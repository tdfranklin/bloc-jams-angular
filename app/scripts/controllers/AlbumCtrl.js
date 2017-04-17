(function() {
    function AlbumCtrl() {
            this.albumData = angular.copy(albumPicasso.songs);
    }

    angular
        .module('blocJams')
        .controller('AlbumCtrl', AlbumCtrl);
})();