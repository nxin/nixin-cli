// ----------------------------------------------------------------------
// Default
// ----------------------------------------------------------------------

module.exports = (gulp, config, kernel, $, _) => {

    function brand() {
        console.log($.colors.green(" "));
        console.log($.colors.green(" __ _  _   __ __ __ _"));
        console.log($.colors.green("|  \| || |\ \/ /| ||  \| |"));
        console.log($.colors.green("|_|\__||_|/_/\_\|_||_|\__|"));
        console.log($.colors.green(" "));
    }

    // API
    // ---------------------------------------------------------

    return gulp.task("default", () => {
        brand();
        $.taskListing();
    });
};
