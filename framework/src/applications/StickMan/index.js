
import '/framework/src/core/lang/Thread.js';

namespace `applications` (
    @stylesheets(["/src/./index.css"]);
    class StickMan extends core.ui.World {
        onConnected() {
            this.render();
            this.direction = 1;
   //          var thread = new core.lang.Thread(function(e){
   //          	console.log(e.data)
   //          	postMessage('msg from worker:' + e.data);
   //          });

   //          thread.onmessage = function (event) {
			//     console.log("worker",event.data);
			// };
   //          thread.postMessage("123");

            this.canvas = document.getElementById("canvas");
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			var config = { alpha: true };
			this.gl = this.canvas.getContext("webgl", config) || this.canvas.getContext("experimental-webgl", config);
			if (!this.gl) {
				alert('WebGL is unavailable.');
				return;
			}
			this.mvp = new spine.webgl.Matrix4();
			this.activeSkeleton = "stickman";
			this.skeletons = {};

			this.shader = spine.webgl.Shader.newTwoColoredTextured(this.gl);
			this.batcher = new spine.webgl.PolygonBatcher(this.gl);
			this.mvp.ortho2d(0, 0, this.canvas.width - 1, this.canvas.height - 1);
			this.skeletonRenderer = new spine.webgl.SkeletonRenderer(this.gl);
			// this.debugRenderer = new spine.webgl.SkeletonDebugRenderer(this.gl);
			// this.debugRenderer.drawRegionAttachments = true;
			// this.debugRenderer.drawBoundingBoxes = true;
			// this.debugRenderer.drawMeshHull = true;
			// this.debugRenderer.drawMeshTriangles = true;
			// this.debugRenderer.drawPaths = true;
			// this.debugShader = spine.webgl.Shader.newColored(this.gl);
			this.shapes = new spine.webgl.ShapeRenderer(this.gl);
			this.assetManager = new spine.webgl.AssetManager(this.gl);


			// Tell AssetManager to load the resources for each model, including the exported .skel file, the .atlas file and the .png
			// file for the atlas. We then wait until all resources are loaded in the load() method.
			this.assetManager.loadText("resources/spine/stickman.json");
			this.assetManager.loadTextureAtlas("resources/spine/stickman.atlas");
			this.load();

        }


        async onUpdate(delta){
        	if(this.loading_complete){
	        	if (Key.isDown(Key.RIGHT)) {
	        		this.direction=1;
	        		if(!this.isWalking){
	        			this.idle=false;
	        			this.animationState.setAnimation(0, "2_Sword/run", true);
	        			this.isWalking=true;
	        		}
	        		var sprite = this.skeletons["stickman"];
	        		var skeleton 	= sprite.skeleton;
	        			// skeleton.velocity += .0005;
	        		skeleton.x += skeleton.velocity * this.direction;
	        		skeleton.scaleX = this.direction;
	        		console.log("x",skeleton.x)

	        	}
	        	// else  {
	        	// 	this.isWalking=false;
	        	// 	this.animationState.setAnimation(0, "1_/idle", true);
	        	// 		this.idle=true;

	        	// }
	        	
	        	if (Key.isDown(Key.LEFT)) {
	        		this.direction=-1;
	        		if(!this.isWalking){
	        			this.idle=false;
	        			this.animationState.setAnimation(0, "2_Sword/run", true);
	        			this.isWalking=true;
	        		}
	        		var sprite = this.skeletons["stickman"];
	        		var skeleton 	= sprite.skeleton;
	        			// skeleton.velocity += .0005;
	        			skeleton.scaleX = this.direction;
	        		skeleton.x += skeleton.velocity * this.direction;
	        		console.log("x",skeleton.x)

	        	}
	        	if (Key.isDown(Key.UP)) {
	        		if(this.isjumping){return}
	        		// // this.direction=-1;
	        		// if(!this.isWalking){
	        			// this.idle=false;
	        			// this.isWalking=false;
	        		// 	this.animationState.setAnimation(0, "1_/jump A", true);
	        		// 	this.isWalking=true;
	        		// }
	        		this.animationState.setAnimation(0, "2_Sword/jump B", true);
	        		this.isjumping=true;
	        		await wait(300);
	        		this.isjumping=false;
	        		this.animationState.setAnimation(0, "2_Sword/jump C", true);
	        		await wait(300);
	        		this.animationState.setAnimation(0, "2_Sword/jump D", true);
	        		await wait(100);
	        		this.animationState.setAnimation(0, "2_Sword/run", true);
	        		// var sprite = this.skeletons["stickman"];
	        		// var skeleton 	= sprite.skeleton;
	        			// skeleton.velocity += .0005;
	        			// skeleton.scaleX = this.direction;
	        		// skeleton.x += skeleton.velocity * this.direction;
	        		// console.log("x",skeleton.x)

	        	}

	        	if (Key.isDown(Key.D)) {
	        		this.animationState.setAnimation(0, "2_Sword/slash", false);
	        		await wait(300);
	        		this.animationState.setAnimation(0, "2_Sword/idle fight pose", true);
	        	}
	        	// else  {
	        	// 	this.isWalking=false;
	        	// 	this.animationState.setAnimation(0, "1_/idle", true);
	        	// 		this.idle=true;

	        	// }

	        	if(!this.isWalking){
	        		if(!this.idle){
	        			this.animationState.setAnimation(0, "1_/idle", true);
	        			this.idle=true;
	        		}
	        	}
	        }
        }

        onDraw(interpolation){

        	if(this.loading_complete){
        		this.gl.clearColor(0, 0, 0, 0);
				this.gl.clear(this.gl.COLOR_BUFFER_BIT);

				// Apply the animation state based on the delta time.
				var sprite = this.skeletons["stickman"];
				var state 		= sprite.state;
				var skeleton 	= sprite.skeleton;
				var bounds 		= sprite.bounds;
				var premultipliedAlpha = sprite.premultipliedAlpha;
				state.update(0.033);
				state.apply(skeleton);
				skeleton.updateWorldTransform();

				// Bind the shader and set the texture and model-view-projection matrix.
				this.shader.bind();
				this.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
				this.shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.mvp.values);

				// Start the batch and tell the SkeletonRenderer to render the active skeleton.
				this.batcher.begin(this.shader);


				this.skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
				this.skeletonRenderer.draw(this.batcher, skeleton);
				this.batcher.end();

				this.shader.unbind();
        	}
        }


        load () {
			// Wait until the AssetManager has loaded all resources, then load the skeletons.
			if (this.assetManager.isLoadingComplete()) {
				this.skeletons["stickman"] = this.loadSkeleton("stickman", "1_/__jump attack", true);
				this.skeletons["stickman"].skeleton.velocity=6;
				this.loading_complete=true;
				this.resize()
				console.log("stickman", this.skeletons["stickman"]);

			} else {
				setTimeout(_=>this.load(),100);
			}
		}


		loadSkeleton (name, initialAnimation, premultipliedAlpha, skin) {
			if (skin === undefined) skin = "black";

			// Load the texture atlas using name.atlas from the AssetManager.
			this.atlas = this.assetManager.get("resources/spine/stickman.atlas");
			// Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
			this.atlasLoader = new spine.AtlasAttachmentLoader(this.atlas);

			// Create a SkeletonBinary instance for parsing the .skel file.
			var skeletonBinary = new spine.SkeletonJson(this.atlasLoader);

			// Set the scale to apply during parsing, parse the file, and create a new skeleton.
			var skeletonData = skeletonBinary.readSkeletonData(this.assetManager.get("resources/spine/stickman.json"));
			var skeleton = new spine.Skeleton(skeletonData);
			skeleton.setSkinByName(skin);
			var bounds = this.calculateBounds(skeleton);

			// Create an AnimationState, and set the initial animation in looping mode.
			var animationStateData = new spine.AnimationStateData(skeleton.data);
			var animationState = new spine.AnimationState(animationStateData);
			if (name == "stickman") {
				animationStateData.setMix("1_/idle", "2_Sword/run", 0.05);
				animationStateData.setMix("2_Sword/run", "1_/idle", 0.5);
				animationStateData.setMix("2_Sword/run", "2_Sword/jump B", 0.05);
				animationStateData.setMix("2_Sword/jump B", "1_/idle", 0.25);
				animationStateData.setMix("2_Sword/jump B", "2_Sword/jump C", 0.25);
				animationStateData.setMix("2_Sword/jump C", "2_Sword/jump D", 0.25);
				animationStateData.setMix("2_Sword/jump D", "1_/run", 0.25);
				animationStateData.setMix("2_Sword/idle fight pose", "1_/run", 0.25);
				animationStateData.setMix("2_Sword/idle fight pose", "2_Sword/run", 0.25);
				animationStateData.setMix("1_/run", "2_Sword/idle fight pose", 0.25);
				// animationStateData.setMix("walk", "shoot", 0);
				this.animationState=animationState;
				this.animationStateData = animationStateData;
				animationState.setAnimation(0, "1_/idle", true);
			} else {
				// animationStateData.setDefaultMix(0.1);
				// animationStateData.setMix("1_/idle", "1_/run", 0.05);
				// animationStateData.setMix("1_/run", "1_/idle", 0.5);
				// // animationStateData.setMix("jump", "run", 0.25);
				// // animationStateData.setMix("walk", "shoot", 0);
				// this.animationState=animationState;
				// this.animationStateData = animationStateData;
				// animationState.setAnimation(0, "1_/idle", true);
			}
			animationState.addListener({
				start: function(track) {
					// console.log("Animation on track " + track.trackIndex + " started");
				},
				interrupt: function(track) {
					// console.log("Animation on track " + track.trackIndex + " interrupted");
				},
				end: function(track) {
					// console.log("Animation on track " + track.trackIndex + " ended");
				},
				disposed: function(track) {
					// console.log("Animation on track " + track.trackIndex + " disposed");
				},
				complete: function(track) {
					// console.log("Animation on track " + track.trackIndex + " completed");
				},
				event: function(track, event) {
					// console.log("Event on track " + track.trackIndex + ": " + JSON.stringify(event));
				}
			})

			// Pack everything up and return to caller.
			return { skeleton: skeleton, state: animationState, bounds: bounds, premultipliedAlpha: premultipliedAlpha };
		}


		calculateBounds(skeleton) {
			skeleton.setToSetupPose();
			skeleton.updateWorldTransform();
			var offset = new spine.Vector2();
			var size = new spine.Vector2();
			skeleton.getBounds(offset, size, []);
			return { offset: offset, size: size };
		}


		resize () {
			var w = window.innerWidth;
			var h = window.innerHeight;
			var bounds = this.skeletons[this.activeSkeleton].bounds;
			if (this.canvas.width != w || this.canvas.height != h) {
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
			}

			// magic
			var centerX = bounds.offset.x + bounds.size.x / 2;
			var centerY = bounds.offset.y + bounds.size.y / 2;
			var scaleX = bounds.size.x / canvas.width;
			var scaleY = bounds.size.y / canvas.height;
			var scale = Math.max(scaleX, scaleY) * 1.2;
			if (scale < 1) scale = 1;
			var width = this.canvas.width * scale;
			var height = this.canvas.height * scale;

			this.mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
			this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		}

    }
);