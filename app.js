
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }



    var camera, controls, scene, renderer;
    var lighting, ambient, keyLight, fillLight, backLight;

    var materials;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var female;



    //different textures / outfits
    var texture1 = 'female-croupier-2013-03-26.mtl';
    var texture2 = 'fem-texture2.mtl';
    var texture3 = 'fem-texture3.mtl';
    var texture4 = 'fem-texture4.mtl';
    var texture5 = 'fem-texture5.mtl';



    var mtlLoader = new THREE.MTLLoader();




    init();
    animate();


    function init() {

        container = document.createElement('div');
        document.body.appendChild(container);


        /* Camera */

        camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 5000 );
        camera.position.z = 8;


        /* Scene */

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
        scene.fog.color.setHSL( 0.6, 0, 1 );
        scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
        scene.fog.color.setHSL( 0.6, 0, 1 );


        //* LIGHTS */

        lighting = false;

        ambient = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambient);

        keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
        keyLight.position.set(-100, 0, 100);




        hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 500, 0 );
        scene.add( hemiLight );




        //* GROUND */

        var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
        var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
        groundMat.color.setHSL( 0.095, 1, 0.75 );

        var ground = new THREE.Mesh( groundGeo, groundMat );
        ground.rotation.x = -Math.PI/2;
        ground.position.y = -60;
        ground.receiveShadow = true;
        scene.add( ground );




        //* SKYDOME */

        var vertexShader = document.getElementById( 'vertexShader' ).textContent;
        var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
        var uniforms = {
          topColor:    { value: new THREE.Color( 0x0077ff ) },
          bottomColor: { value: new THREE.Color( 0xffffff ) },
          offset:      { value: 33 },
          exponent:    { value: 0.6 }
        };



        var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
        var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
        // var skyMat = new THREE.MeshPhongMaterial( { color: 0x0077ff, specular: 0x050505 } );
        // skyMat.color.setHSL( 0.095, 1, 0.75 );
        var sky = new THREE.Mesh( skyGeo, skyMat );
        scene.add( sky );




        //* MODEL */

        // var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setBaseUrl('assets/');
        mtlLoader.setPath('assets/');
        mtlLoader.load(texture1, function (materials) {

            materials.preload();

            materials.materials.default.map.magFilter = THREE.NearestFilter;
            materials.materials.default.map.minFilter = THREE.LinearFilter;

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('assets/');
            objLoader.load('female-croupier-2013-03-26.obj', function (object) {
              object.castShadow = true;
              object.receiveShadow = true;

              object.position.y += 0.00;

              var heightFem = object.scale.y;
              var widthFront = object.scale.z;
              var widthSide = object.scale.x;



              female = object;
              scene.add(object);

            });

        });


        //* Renderer */

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor( scene.fog.color );
        renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

        container.appendChild(renderer.domElement);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.renderReverseSided = false;



        //* Controls */

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = false;


        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;



        //* Events */

        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', onKeyboardEvent, false);

    }   // end of init function




  function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }




  function onKeyboardEvent(e) {

    if (e.code === 'KeyL') {
      lighting = !lighting;
      if (lighting) {
        ambient.intensity = 1.25;
        scene.add(keyLight);
        scene.add(fillLight);
        scene.add(backLight);
      } else {
        ambient.intensity = 0.90;
        scene.remove(keyLight);
        scene.remove(fillLight);
        scene.remove(backLight);
      }
    }

  }



  function animate() {

    requestAnimationFrame(animate);
    controls.update();
    render();

  }



  function render() {
    renderer.render(scene, camera);
  }




// CHANGE TEXTURE / outfits

  var replaceMaterial = function(event) {

    var clickedTexture = event.target.src;

    if (event.target.src === 'http://127.0.0.1:8080/assets/icons/icon3.png') {
      clickedTexture = texture3;
    } else if (event.target.src === 'http://127.0.0.1:8080/assets/icons/icon2.png') {
      clickedTexture = texture2;
    } else if (event.target.src === 'http://127.0.0.1:8080/assets/icons/fem-t.png') {
      clickedTexture = texture1;
    } else if (event.target.src === 'http://127.0.0.1:8080/assets/icons/icon4.png') {
      clickedTexture = texture4;
    } else if (event.target.src === 'http://127.0.0.1:8080/assets/icons/icon5.png') {
      clickedTexture = texture5;
    }


    mtlLoader.setBaseUrl('assets/');
    mtlLoader.setPath('assets/');


    mtlLoader.load(clickedTexture, function (materials) {

      materials.preload();
      materials.materials.default.map.magFilter = THREE.NearestFilter;
      materials.materials.default.map.minFilter = THREE.LinearFilter;

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('assets/');
      objLoader.load('female-croupier-2013-03-26.obj', function (object) {
        // object.castShadow = true;
        // object.receiveShadow = true;
          scene.remove(female);
          female = object;
          scene.add(object);
      });

  });
  }



  $('img').click(function(event) {
    replaceMaterial(event);
  });



// CHANGE SIZE / scale

  var inputOne = document.getElementsByTagName('input')[0];
  var inputTwo = document.getElementsByTagName('input')[1];

  var sizeBtn = document.getElementById('changeSizeBtn');

  sizeBtn.addEventListener('click', function(object) {
    object.scale.x = Number(inputOne.value)
    object.scale.y = Number(inputTwo.value)
    object.scale.z = Number(inputTwo.value);
  });
