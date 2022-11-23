export const detectWayspotPipelineModule = () => {
    let wayspotMeshForShadow = null
    let wayspotMeshForOcclusion = null
  
    const loader = new THREE.GLTFLoader()
    const anchorPositionFile = require('./assets/anchorPositions.glb')
    const wayspotFile = require('./assets/wayspot.glb')
  
    const handleWayspotUpdate = ({detail}) => {
      const {id, position, rotation} = detail
      wayspotMeshForShadow.position.copy(position)
      wayspotMeshForShadow.quaternion.copy(rotation)
  
      wayspotMeshForOcclusion.position.copy(position)
      wayspotMeshForOcclusion.quaternion.copy(rotation)
    }
  
    const handleWayspotFound = ({detail}) => {
      const {name, position, rotation} = detail
      const {scene} = XR8.Threejs.xrScene()
  
      // wayspotのglbを読み込み
      loader.load(
        wayspotFile,
        (gltf) => {
          wayspotMeshForShadow = gltf.scene
          wayspotMeshForOcclusion = wayspotMeshForShadow.clone()
  
          const shadowMat = new THREE.ShadowMaterial({opacity: 0.5, color: 0x0a0a0a})
          const occlusionMat = new THREE.MeshPhongMaterial({colorWrite: false})
  
          wayspotMeshForShadow.traverse((object) => {
            if (object.isMesh) {
              object.material = shadowMat
              object.receiveShadow = true
            }
          })
  
          wayspotMeshForOcclusion.traverse((object) => {
            if (object.isMesh) {
              object.material = occlusionMat
            }
          })
  
          scene.add(wayspotMeshForShadow)
          scene.add(wayspotMeshForOcclusion)
  
          // blenderで作った配置用のglbを読み込み
          loader.load(
            anchorPositionFile,
            (p) => {
              for (let i = 0; i < p.scene.children.length; i++) {
                const ge = new THREE.BoxGeometry(0.2, 0.2, 0.2)
                const ma = new THREE.MeshStandardMaterial({color: 0x00ff00})
                const obj = new THREE.Mesh(ge, ma)
                const pos = p.scene.children[i].position
                obj.position.copy(p.scene.children[i].position)
                obj.quaternion.copy(p.scene.children[i].quaternion)
                obj.castShadow = true
                wayspotMeshForOcclusion.attach(obj)
              }
            }
          )
        }
      )
    }
  
    return {
      name: 'detect-wayspot',
  
      listeners: [
        {event: 'reality.projectwayspotfound', process: handleWayspotFound},
        {event: 'reality.projectwayspotupdated', process: handleWayspotUpdate},
      ],
    }
  }