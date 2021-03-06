import { jt400 } from './db'
import { expect } from 'chai'
import * as streamEqual from 'stream-equal'
import q = require('q')
const { ifs } = jt400

describe('ifs', function() {
    it('should read file', function(done) {
        this.timeout(50000);
        var stream = ifs().createReadStream('/atm/test/hello_world.txt');
        var data = '';
        stream.on('data', function(chunk) {
            data += chunk;
        });

        stream.on('end', function() {
            expect(data).to.equal('Halló heimur!\n');
            done();
        });

        stream.on('error', done);
    });

    it('should read filename promise', function(done) {
        this.timeout(50000);
        var stream = ifs().createReadStream(q('/atm/test/hello_world.txt'));
        var data = '';
        stream.on('data', function(chunk) {
            data += chunk;
        });

        stream.on('end', function() {
            expect(data).to.equal('Halló heimur!\n');
            done();
        });

        stream.on('error', done);
    });

    it('should write file', function(done) {
        this.timeout(50000);
        const rs = ifs().createReadStream('/atm/test/hello_world.txt');
        const ws = ifs().createWriteStream('/atm/test2/new_file.txt', { append: false });

        rs.pipe(ws).on('finish', function() {
            const stream = ifs().createReadStream('/atm/test2/new_file.txt');
            let data = '';
            stream.on('data', function(chunk) {
                data += chunk;
            });

            stream.on('end', function() {
                expect(data).to.equal('Halló heimur!\n');
                done();
                /*  
                                ifs().deleteFile('/atm/test2/new_file.txt')
                                    .then((res) => {
                                        expect(res).to.equal(true);
                                        done();
                                    })
                                    .catch(done);                    
                */
            });

            stream.on('error', done);
        }).on('error', done);
    });

    it('should pipe image', function(done) {
        this.timeout(50000);
        const rs = ifs().createReadStream('/atm/test/image.jpg');
        const ws = ifs().createWriteStream('/atm/test2/image.jpg', { append: false });

        rs.pipe(ws).on('finish', function() {
            const oldImage = ifs().createReadStream('/atm/test/image.jpg');
            const newImage = ifs().createReadStream('/atm/test2/image.jpg');

            streamEqual(oldImage, newImage, (error, equal) => {
                expect(error).to.be.null;
                expect(equal).to.be.true;
                done();
            });


        });
    });
});