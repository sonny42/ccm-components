module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        //serve files on localhost:9000
        serve: {
            options: {
                port: 9000
            }
        },
        //live reload on source change
        watch:{
            files:['*.js', '*.html', '*.json', '*.css'], //include json files to enable reload on ccm template change
            options: {
                livereload: 9001
            }
        }
    });

    grunt.registerTask('default', ['watch']);
}
