AFRAME.registerComponent('model-subset', {
  schema: {
    target: {default: '', type: 'selector'},
    name: {default: ''}
  },
  init: function () {
    var el = this.el;
    var data = this.data;
    data.target.addEventListener('model-loaded', function (e) {
      var model = e.detail.model;
      var subset = model.getObjectByName(data.name);
      el.setObject3D('mesh', subset.clone());
    });
  },
  update: function () { /* ... */ },
  remove: function () { /* ... */ }
});


/* global AFRAME */
AFRAME.registerComponent('main', {
  init: function () {
    var urlParams = this.getUrlParams();
    //var defaultNumObjects = 5000;
    var defaultNumObjects = 100;
    var numObjects = urlParams.numobjects || defaultNumObjects;
    this.cubeDistributionWidth = 100;
    for (var i = 0; i < numObjects; i++) {
      // cube
      //var cubeEl = document.createElement('a-entity');

      // glTf
      let item;
      var cubeEl;
      switch( i % 4){
        case 0 : 
          item = "#tree1"; 
          cubeEl = document.createElement('a-gltf-model'); 
          break;
        case 1 : item = "#tree2"; cubeEl = document.createElement('a-gltf-model');break;
        case 2 : item = "#crate-obj"; cubeEl = document.createElement('a-obj-model');break;
        case 3 : item = "#brainstem"; cubeEl = document.createElement('a-gltf-model');break;
      }
      

      // text
      let textEl = document.createElement('a-text');
      textEl.setAttribute('value', "Top of box\n(even when multi-line)\naileronsemibold font");
      textEl.setAttribute('position', "-1 1 0");
      cubeEl.appendChild(textEl);


      if (urlParams.component) {
        cubeEl.setAttribute(urlParams.component, '');
      }

      cubeEl.setAttribute('src', item);
      cubeEl.setAttribute('position', this.getRandomPosition());
      // cubeEl.setAttribute('geometry', {primitive: 'box'});
      // cubeEl.setAttribute('material', {color: this.getRandomColor(), shader: 'flat'});
      if( i % 4 == 2 ){
        // case 2
        cubeEl.setAttribute('mtl', "#crate-mtl");
      }
      
      cubeEl.setAttribute('scale', '1.4 1.4 1.4');
      this.el.sceneEl.appendChild(cubeEl);

      //console.log(cubeEl);
    }
    console.log(this);
    console.log(this.el);
    console.log(this.el.sceneEl);
  },

  getUrlParams: function () {
    var match;
    var pl = /\+/g;  // Regex for replacing addition symbol with a space
    var search = /([^&=]+)=?([^&]*)/g;
    var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
    var query = window.location.search.substring(1);
    var urlParams = {};

    match = search.exec(query);
    while (match) {
      urlParams[decode(match[1])] = decode(match[2]);
      match = search.exec(query);
    }
    return urlParams;
  },

  getRandomPosition: function () {
    var cubeDistributionWidth = this.cubeDistributionWidth;
    return {
      x: Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2,
      y: Math.random() * cubeDistributionWidth - cubeDistributionWidth / 2,
      z: Math.random() * cubeDistributionWidth - cubeDistributionWidth
    };
  },

  getRandomColor: function () {
    return '#' + ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
  }
});
