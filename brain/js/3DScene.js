//disable scrollbars within the iFrame
function reloadScrollBars() { document.documentElement.style.overflow = 'auto';  }// firefox, chrome
function unloadScrollBars() { document.documentElement.style.overflow = 'hidden'; } // firefox, chrome
//unloadScrollBars();


window.onload = function() {
    
    //////////////////////////////////////////////////////////////GRAPHICS QUALITY////////////////////////////////////////////////////////
    //before loading anything in the scene, the user must click to select high or low graphics quality
    
    var graphicsQuality = 'high';
    
    ////////////////////////////////////////////////////////////.OBJ FILES///////////////////////////////////////////////////////////////
    //these arrays contain objects that define the location of each obj. file to be loaded into the scene (along with additional information) 
    
    var corticalFiles = [
        {name:'occipitalLobeR', 
         label: 'Occipital lobe', 
         cortical: true,
         whiteMatter: false,
         path:'/CR-OL', 
        },
        {name:'parietalLobeR',
         label: 'Parietal lobe',
         cortical: true,
         whiteMatter: false,
         path:'/CR-PL',
        },
        {name:'temporalLobeR',
         label: 'Temporal lobe',
         cortical: true,
         whiteMatter: false,
         path:'/CR-TL'
        },
        {name:'frontalLobeRpart',
         label: 'Frontal lobe part',
         cortical: true,
         whiteMatter: false,
         path:'/CR-FL'
        },
        {name:'limbicLobeR',
         label: 'Limbic lobe',
         cortical: true,
         whiteMatter: false,
         path:'/CR-LL'
        },
        {name:'prefrontalCortexR',
         label: 'Prefrontal cortex',
         cortical: true,
         whiteMatter: false,
         path:'/CR-PFL'  
        },
        {name:'insulaR',
         label: 'Insula',
         cortical: true,
         whiteMatter: false,
         path:'/CR-I' 
        },
        {name:'occipitalLobeL',
         label: 'Occipital lobe',
         cortical: true,
         whiteMatter: false,
         path:'/CL-OL'
        },
        {name:'parietalLobeL',
         label: 'Parietal lobe',
         cortical: true,
         whiteMatter: false,
         path:'/CL-PL' 
        },
        {name:'temporalLobeL',
         label: 'Temporal lobe',
         cortical: true,
         whiteMatter: false,
         path:'/CL-TL' 
        },
        {name:'frontalLobeLpart',
         label: 'Frontal lobe part',
         cortical: true,
         whiteMatter: false,
         path:'/CL-FL' 
        },
        {name:'limbicLobeL',
         label: 'Limbic lobe',
         cortical: true,
         whiteMatter: false,
         path:'/CL-LL'  
        },
        {name:'prefrontalCortexL',
         label: 'Prefrontal cortex',
         cortical: true,
         whiteMatter: false,
         path:'/CL-PFL'  
        },
        {name:'insulaL',
         label: 'Insula',
         cortical: true,
         whiteMatter: false,
         path:'/CL-I' 
        }
    ];
    
    var subcorticalFiles = [
        {name:'brainstem',
         label: 'Brainstem',
         cortical: false,
         whiteMatter: false,
         path:'/Brainstem'
        },
        {name:'cerebellum',
         label: 'Cerebellum',
         cortical: false,
         whiteMatter: false,
         path:'/Cerebellum'
        },
        {name:'spinalCord',
         label: 'Spinal cord',
         cortical: true,
         whiteMatter: false,
         path:'/SpinalCord'
        }
    ]
    
    var whiteMatterFiles = [
        {name:'CC',
         label: 'Corpus callosum',
         cortical: true,
         whiteMatter: true,
         path:'/CC' 
        }
    ]
    
    /////////////////////////////////////////////////////////ASSORTED GLOBAL VARIABLES//////////////////////////////////////////////////////////////
    
    //scene basics
    var renderer, scene, camera, container, envMap;
    var containerWidth, containerHeight;
    var controls, lights;
    
    //obj loading
    var manager = new THREE.LoadingManager();
    var objLoader = new THREE.OBJLoader(manager); 
    var textureLoader = new THREE.TextureLoader();
    
    //object organization
    var group = new THREE.Group(); 
    var corticalGroup = new THREE.Group();
    var subcorticalGroup = new THREE.Group();
    var whiteMatterGroup = new THREE.Group();
    
    var objGroupsToCheck = []; 
    
    var selectable = []; 
    
    var FL = []; 
    var TL = []; 
    var OL = []; 
    var PL = [];
    var LL = []; 
    
    var proj = []; 
    var assoc = []; 
    var commiss = []; 
    var WM = []; 
    var GM = []; 
    
    var TR = [];
    var CST = [];
    var Cin = []; 
    var IFO = []; 
    var IL = []; 
    var SFO = [];
    var SL = [];
    var Unc = [];
    
    var LH = [];
    var RH = [];
    var PFC = [];
    var BG = [];
    var cortex = [];
    
    //colours for object appearance on hover and click
    var colorObjectNotSelected = 0xffffff;
    var colorObjectSelected = 0xec6c77;
    var colorEmissiveOnHover = 0x5a0000;
    
    //object picking basics
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var intersects;
    var intersected = []; 
    var selected = [];
    
    //////////////////////////////////////////////////////SCENE SETUP///////////////////////////////////////////////////////////
    
    //get the div to place the renderer in, store its dimensions
    var container = document.getElementById( 'canvas' ); 
    
    containerWidth = container.offsetWidth;
    
    container.style.height = containerWidth+"px";
    containerHeight = container.offsetHeight;

    //set up renderer to size of canvas div, add to canvas div
    renderer = Detector.webgl? new THREE.WebGLRenderer({antialias:true}): new THREE.CanvasRenderer();
    
    renderer.setPixelRatio(window.devicePixelRatio);
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor( 0xffffff, 1);
    container.appendChild( renderer.domElement );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    
    //create 3D scene
    scene = new THREE.Scene();
   
    //create and add camera to the scene
    camera = new THREE.OrthographicCamera(containerWidth/-100, containerWidth/100, containerHeight/100, containerHeight/-100, 0, 1000)
    camera.position.set( 0, 0, 10 );
    camera.lookAt( scene.position );
    
    
    //resize renderer on window resize
    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize(){
        containerWidth = container.clientWidth;
        container.style.height = containerWidth+"px";
        containerHeight = container.clientHeight;
        camera.left = containerWidth/-100;
        camera.right =  containerWidth/100;
        camera.top = containerHeight/100;
        camera.bottom = containerHeight/-100;
        camera.updateProjectionMatrix();
        renderer.setSize(containerWidth, containerHeight );
        
        if (containerWidth < 200) {
            group.scale.x = 0.75;
            group.scale.y = 0.75;
            group.scale.z = 0.75;
        } else if (containerWidth < 320) {
            group.scale.x = 1;
            group.scale.y = 1;
            group.scale.z = 1;
        } else if (containerWidth < 420) {
            group.scale.x = 1.5;
            group.scale.y = 1.5;
            group.scale.z = 1.5;
        } else if (containerWidth < 520) {
            group.scale.x = 2;
            group.scale.y = 2;
            group.scale.z = 2;
        } else if (containerWidth < 620) {
            group.scale.x = 2.5;
            group.scale.y = 2.5;
            group.scale.z = 2.5;
        } else {
            group.scale.x = 3;
            group.scale.y = 3;
            group.scale.z = 3;
        }
        
        console.log("height: "+containerHeight);
        console.log("width: "+containerWidth);

    }
    
    //lights
    lights = [];
    lights[ 0 ] = new THREE.DirectionalLight( 0xffffff, 0.3 );
    lights[ 0 ].position.set( 0, 50, 70 );

    lights[ 1 ] = new THREE.DirectionalLight( 0xffffff, 0.5 );
    lights[ 1 ].position.set( 35, 0, 35 );

    lights[ 2 ] = new THREE.DirectionalLight( 0xffffff, 0.2 );
    lights[ 2 ].position.set( -70, 0, 0 );
    
    lights[ 3 ] = new THREE.HemisphereLight(0xffffff, 0xffc3e1, 0.25);
                
    for (var t = 0; t < lights.length; t++) {
        scene.add( lights[t] );
    }    
    
     //////////////////////////////////////////////////////////////////TOOLTIP/////////////////////////////////////////////////////////////
    
    var message = "";
    var tooltip = document.getElementById("tooltipDiv");
    tooltip.textContent = message;
    tooltip.style.visibility = "hidden";
    
  
    /////////////////////////////////////////////////////////////////OBJECT PICKING/////////////////////////////////////////////////////////
    function onMouseMove(event) {
        event.preventDefault();
        
        var bounds = container.getBoundingClientRect();
        var x = event.clientX - bounds.left;
        var y = event.clientY - bounds.top;
        
        
        mouse.x = ( x / containerWidth ) * 2 - 1;
	    mouse.y = - ( y / containerHeight ) * 2 + 1;
        
        raycaster.setFromCamera( mouse, camera );
        intersects = raycaster.intersectObjects( selectable, false );
        
         //////////////////tooltip///////////////////////
        tooltip.style.left = event.clientX+10+'px';
        tooltip.style.top = event.clientY+'px';
        //////////////////////////////////////////////////
        
        if ( intersects.length > 0 ) {
            
            //if object not already selected
            if ( intersected.indexOf(intersects[ 0 ].object ) === -1 ) {
                
				if ( intersected.length > 0 ) {
                    for (var v = 0; v < intersected.length; v++) {
                        intersected[v].material.emissive.setHex( 0x000000 ) //hover new, old gets no emissive
                    }
                };
				intersected = [];
                for (var g = 0; g < objGroupsToCheck.length; g++) {
                    if (objGroupsToCheck[g].indexOf(intersects[ 0 ].object) !== -1 ) {
                        
                        //////////////////tooltip////////////////////////
                        message = " " + objGroupsToCheck[g][0] + " "; //get current object
                        tooltip.textContent = message; //update the contents of the tooltip with the name of the current object
                        tooltip.style.visibility = "visible"; //make sure the tooltip is visible
                        //////////////////////////////////////////////////
                        
                        for (var h = 1; h < objGroupsToCheck[g].length; h++) {
                            intersected.push(objGroupsToCheck[g][h]); //add all relevant objects to selected[]
                            intersected[h-1].material.emissive.setHex( colorEmissiveOnHover ); //change colour of all hovered to red
                        }
                    } 
                }
            } 
        } else {
            for (var y = 0; y < intersected.length; y++) {
                intersected[y].material.emissive.setHex( 0x000000 ); //click background to deselect
            }
            intersected = [];
            
            /////////////////////////tooltip/////////////////////////
            message = "";
            tooltip.textContent = message;
            tooltip.style.visibility = "hidden";
            //////////////////////////////////////////////////
        }
    };
                              

    ///////////////////////////////////////////////////CREATE 3D OBJECTS FROM .OBJ & ADD THEM TO THE SCENE///////////////////////////////////////////////////
    
    //call makeMesh for all files in file array
    function startObjectCreation(fileArray) {
        for(var j = 0; j < fileArray.length; j++) {
        (function (cntr) {
            makeMesh(fileArray[cntr].path, function(meshToReturn){window[fileArray[cntr].name] = meshToReturn;})
        }(j));
        }
    }
    
    //create meshes from .obj files and .jpg maps
    function makeMesh(path,callback) {
        var bufferGeo, geo, mesh, DM, TM, NM, mat;
        //load normal maps and texture maps
        NM = textureLoader.load('brain/materials/'+graphicsQuality+'/NM'+path+'-NM.jpg');
        TM = textureLoader.load('brain/materials/'+graphicsQuality+'/TM'+path+'-TM.jpg');
    
        //if user picks low graphics quality, make lower quality MeshPhongMaterial
        if (graphicsQuality == "low") {
            mat = new THREE.MeshPhongMaterial({
                transparent:true, //allows us to change the opacity if needed
                normalMap:NM,
                reflectivity: 0.1,
                shininess:200,
                specular:0x070707,
                map:TM,
                refractionRatio:0.5,
                shading:THREE.SmoothShading,
                side:THREE.FrontSide //only render the user-facing side of the mesh (backside is unnecessary, for the most part)
            });
        //else make high quality physical material
        } else {
           mat = new THREE.MeshPhysicalMaterial({
                clearCoat: 0.5,
                clearCoatRoughness: 0.25,
                transparent:true,
                normalMap:NM,
                reflectivity: 0,
                roughness:1,
                metalness:0,
                map:TM,
                refractionRatio:0.5,
                shading:THREE.SmoothShading,
                side:THREE.FrontSide
            }); 
        }
       
        //load the given .obj file from the 'high' or 'low' folder based on user's graphics quality preference
        objLoader.load('brain/models/'+graphicsQuality+path+'.OBJ', function (obj) {
        //objLoader by default loads .obj files in as bufferGeometry (not straight geometry)
        bufferGeo = obj;
            bufferGeo.traverse(function (child) { //traverse iterates contained function over all children of object
                if (child instanceof THREE.Mesh) {
                    geo = new THREE.Geometry().fromBufferGeometry(child.geometry); //create geometry from buffer geometry
                    geo.mergeVertices();
                    geo.computeVertexNormals();
                    geo.computeFaceNormals();
                }
            });

        mesh = new THREE.Mesh(geo, mat); //create a mesh from the material and loaded geometry
        callback(mesh); //return the mesh for access outside of function
        });   
    };
    
    //loading manager monitors objLoader
    //once all of the 3D objects are loaded, start adding them to the scene
    manager.onLoad = function() {
        addObjects(corticalFiles,corticalGroup);
        addObjects(subcorticalFiles,subcorticalGroup);
        addObjects(whiteMatterFiles,whiteMatterGroup);
        console.log("loaded");
        addToScene(); //add new 3D objects to the scene
        
        //////////////////////////////EVENT LISTENERS///////////////////////////////
        //click model, hover over model
        document.addEventListener('mousemove', onMouseMove, false);
    }
    
    function newW() {
        $("#cover").hide();
        $("#spinner").hide();
    }
    setTimeout(newW, 20000);
    
    //add 3D objects to groups, and make them accessible via variable names from file arrays
    function addObjects(files,lobeGroup){
        
        for(var m = 0; m < files.length; m++) {
            (function (cntr) {
                
                //store all info from original file array in properties of new 3D object 
                window[files[cntr].name].name = files[cntr].name;
                window[files[cntr].name].cortical = files[cntr].cortical;
                window[files[cntr].name].whiteMatter = files[cntr].whiteMatter;
                window[files[cntr].name].label = files[cntr].label;
                files[cntr].obj = window[files[cntr].name]; 
        
                lobeGroup.add(window[files[cntr].name]);
                //add new 3D object to an array to be used for object picking (this array is passed to the raycaster)
                selectable.push(window[files[cntr].name]);
                
                //adjust the rotation of the new 3D object so that it faces a certain way on load
                files[cntr].obj.rotation.x = toRadians(-100);
                files[cntr].obj.rotation.z = toRadians(180);
                
                
            }(m));
        }
    }
    
    //add all objects to scene, group them for selection, and modify their materials (has to be done after they've been created)
    function addToScene(){
        console.log("in addtoscene");
    
        
        //group is a Group that will contain all of the 3D objects in the scene, so that everything can be controlled at once
        group.scale.x = 3;
        group.scale.y = 3;
        group.scale.z = 3;
        group.position.y = 1;
        
        //add subgroups to main group
        //add group to scene
        group.add(corticalGroup, subcorticalGroup, whiteMatterGroup);
        scene.add(group);
        
        //group all objects into arrays for object picking
        FL.push("Frontal lobe", frontalLobeLpart, frontalLobeRpart, prefrontalCortexL, prefrontalCortexR);
        TL.push("Temporal lobe", temporalLobeL, temporalLobeR, insulaL, insulaR);
        OL.push("Occipital lobe", occipitalLobeL, occipitalLobeR);
        PL.push("Parietal lobe", parietalLobeL, parietalLobeR);
        LL.push("Limbic lobe", limbicLobeL, limbicLobeR);
        LH.push("Left hemisphere", frontalLobeLpart, prefrontalCortexL, temporalLobeL, occipitalLobeL, limbicLobeL, insulaL, parietalLobeL);
        RH.push("Right hemisphere", frontalLobeRpart, prefrontalCortexR, temporalLobeR, occipitalLobeR, limbicLobeR, insulaR, parietalLobeR);
        PFC.push("Prefrontal cortex", prefrontalCortexL, prefrontalCortexR);
        cortex.push("Cortex", frontalLobeLpart, prefrontalCortexL, temporalLobeL, occipitalLobeL, limbicLobeL, parietalLobeL,frontalLobeRpart, prefrontalCortexR, temporalLobeR, occipitalLobeR, limbicLobeR, parietalLobeR, insulaL, insulaR);
        
        var all = [];
        all.push(frontalLobeLpart, prefrontalCortexL, temporalLobeL, occipitalLobeL, limbicLobeL, parietalLobeL,frontalLobeRpart, prefrontalCortexR, temporalLobeR, occipitalLobeR, limbicLobeR, parietalLobeR, insulaL, insulaR, cerebellum, spinalCord, CC, brainstem);
        
        
        //make white matter less shiny
        for (var r = 1; r < WM.length; r++) {
            WM[r].material.clearCoat = 0.2;
        }
        
        //make cerebral cortex double-sided (can sometimes see inner side)
        for (var s = 1; s < cortex.length; s++) {
            cortex[s].material.side = THREE.DoubleSide;
        }
    
        //for object picking: objects to check for intersections on user hover/click on model (2D array)
        objGroupsToCheck.push(PL, FL, TL, OL, LL, ["Brainstem", brainstem], ["Cerebellum", cerebellum], ["Spinal cord",spinalCord], [CC.label, CC]);
    
        onWindowResize();
        $("#portfolioImage").hide();
        
        function hideStuff() {
            $("#cover").hide();
            $("#spinner").hide();
        }
        setTimeout(hideStuff, 2000);

    }
    
    
    /////////////////////////////////////////////////////////////ASSORTED FUNCTIONS///////////////////////////////////////////////////////////
    
    function toRadians(angle) { return angle * (Math.PI / 180) }
    function toDegrees(angle) { return angle * (180 / Math.PI) }

    
   
    /////////////////////////////////////////////////////////////RENDER FUNCTIONS//////////////////////////////////////////////////////////////
    
    startObjectCreation(corticalFiles); //start making 3D objects out of the .obj files 
    startObjectCreation(subcorticalFiles);
    startObjectCreation(whiteMatterFiles);

    
    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera )
        group.rotation.y +=  0.003;
    }
    
    function render() { 
        renderer.render( scene, camera );
    }
    
    
    animate();
        
};

