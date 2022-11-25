import './index.css'
import {initScenePipelineModule} from './threejs-scene-init'
import {detectWayspotPipelineModule} from './detect-wayspot.js'
import {detectMeshPipelineModule} from './detect-mesh.js'
import * as camerafeedHtml from './camerafeed.html'

const onxrloaded = () => {
  //vpsの使用を有効化
  XR8.XrController.configure({ enableVps : true })
  VpsCoachingOverlay.configure({
    textColor: '#0000FF',
    promptPrefix: 'Go look for',
  })
  XR8.addCameraPipelineModules([
    XR8.GlTextureRenderer.pipelineModule(),
    XR8.Threejs.pipelineModule(),
    XR8.XrController.pipelineModule(),
    LandingPage.pipelineModule(), 
    VpsCoachingOverlay.pipelineModule(),
    XRExtras.FullWindowCanvas.pipelineModule(),
    XRExtras.Loading.pipelineModule(),
    XRExtras.RuntimeError.pipelineModule(),
    // Custom pipeline modules.
    initScenePipelineModule(),
    // detectWayspotPipelineModule(),
    detectMeshPipelineModule()
  ])


  document.body.insertAdjacentHTML('beforeend', camerafeedHtml)
  const canvas = document.getElementById('camerafeed')

  XR8.run({canvas})
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)