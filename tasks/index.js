// ----------------------------------------------------------------------
// Tasks
// ----------------------------------------------------------------------


module.exports = (gulp, nix) => {

    nix.tasks.forEach((task) => {
        return require(`./_${task}`)(gulp, nix.config, nix.kernel, nix.$);
    });
};
