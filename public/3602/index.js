/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // ── DOM references ──────────────────────────────────────────────
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

  // ── Mobile / desktop detection ──────────────────────────────────
  if (window.matchMedia) {
    var setMode = function() {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add('desktop');
  }

  // ── Touch detection ─────────────────────────────────────────────
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function() {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  });

  // ── IE fallback ─────────────────────────────────────────────────
  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  // ── Viewer initialization ───────────────────────────────────────
  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  };

  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  // ── Build adjacency graph ───────────────────────────────────────
  function buildAdjacencyGraph() {
    var graph = {};
    data.scenes.forEach(function(s) {
      graph[s.id] = [];
      s.linkHotspots.forEach(function(h) {
        if (graph[s.id].indexOf(h.target) === -1) {
          graph[s.id].push(h.target);
        }
      });
    });
    return graph;
  }
  var adjacencyGraph = buildAdjacencyGraph();

  // ── Preload system ──────────────────────────────────────────────
  var preloaded = {};
  var preloading = {};

  function preloadSceneTiles(sceneId) {
    if (preloaded[sceneId] || preloading[sceneId]) return;
    preloading[sceneId] = true;
    var urlPrefix = 'tiles/' + sceneId;

    var previewImg = new Image();
    previewImg.onload = function() { preloaded[sceneId] = true; };
    previewImg.onerror = function() { preloading[sceneId] = false; };
    previewImg.src = urlPrefix + '/preview.jpg';

    var faces = ['f', 'b', 'l', 'r', 'u', 'd'];
    faces.forEach(function(face) {
      var tile = new Image();
      tile.src = urlPrefix + '/1/' + face + '/0/0.jpg';
    });
  }

  function preloadAdjacent(currentSceneId) {
    var adjacent = adjacencyGraph[currentSceneId];
    if (!adjacent) return;
    adjacent.forEach(function(id) {
      preloadSceneTiles(id);
    });
  }

  // ── Scene creation ──────────────────────────────────────────────
  var scenes = data.scenes.map(function(sceneData) {
    var urlPrefix = 'tiles';
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + '/' + sceneData.id + '/{z}/{f}/{y}/{x}.jpg',
      { cubeMapPreviewUrl: urlPrefix + '/' + sceneData.id + '/preview.jpg' });
    var geometry = new Marzipano.CubeGeometry(sceneData.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(
      sceneData.faceSize, 100 * Math.PI / 180, 120 * Math.PI / 180);
    var view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    sceneData.linkHotspots.forEach(function(hotspot) {
      var element = createLinkHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, {
        yaw: hotspot.yaw,
        pitch: hotspot.pitch
      });
    });

    sceneData.infoHotspots.forEach(function(hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, {
        yaw: hotspot.yaw,
        pitch: hotspot.pitch
      });
    });

    return {
      data: sceneData,
      scene: scene,
      view: view
    };
  });

  // ── Current scene tracking ──────────────────────────────────────
  var currentScene = null;

  // ── Find reverse yaw for continuity ─────────────────────────────
  function findReverseYaw(targetSceneId, sourceSceneId) {
    var targetData = findSceneDataById(targetSceneId);
    if (!targetData) return null;
    for (var i = 0; i < targetData.linkHotspots.length; i++) {
      if (targetData.linkHotspots[i].target === sourceSceneId) {
        return targetData.linkHotspots[i].yaw;
      }
    }
    return null;
  }

  // ── Switch scene with smooth transition ─────────────────────────
  function switchScene(targetScene, linkYaw) {
    if (!targetScene) return;
    if (currentScene === targetScene) return;

    stopAutorotate();

    var targetFov = targetScene.data.initialViewParameters.fov;
    var targetPitch = targetScene.data.initialViewParameters.pitch;
    var targetYaw = targetScene.data.initialViewParameters.yaw;

    if (linkYaw !== undefined && currentScene) {
      var reverseYaw = findReverseYaw(targetScene.data.id, currentScene.data.id);
      if (reverseYaw !== null) {
        targetYaw = reverseYaw;
      } else {
        targetYaw = linkYaw + Math.PI;
        if (targetYaw > Math.PI) targetYaw -= 2 * Math.PI;
        if (targetYaw < -Math.PI) targetYaw += 2 * Math.PI;
      }
    }

    targetScene.view.setParameters({
      yaw: targetYaw,
      pitch: targetPitch,
      fov: targetFov
    });

    preloadSceneTiles(targetScene.data.id);

    targetScene.scene.switchTo({ transitionDuration: 450 });

    currentScene = targetScene;

    startAutorotate();
    updateSceneName(targetScene);
    updateSceneList(targetScene);

    setTimeout(function() {
      preloadAdjacent(targetScene.data.id);
    }, 600);
  }

  // ── UI helpers ──────────────────────────────────────────────────
  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.name);
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el.getAttribute('data-id') === scene.data.id) {
        el.classList.add('current');
      } else {
        el.classList.remove('current');
      }
    }
  }

  function showSceneList() {
    sceneListElement.classList.add('enabled');
    sceneListToggleElement.classList.add('enabled');
  }

  function hideSceneList() {
    sceneListElement.classList.remove('enabled');
    sceneListToggleElement.classList.remove('enabled');
  }

  function toggleSceneList() {
    sceneListElement.classList.toggle('enabled');
    sceneListToggleElement.classList.toggle('enabled');
  }

  // ── Autorotate ──────────────────────────────────────────────────
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2
  });
  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }

  autorotateToggleElement.addEventListener('click', toggleAutorotate);

  function startAutorotate() {
    if (!autorotateToggleElement.classList.contains('enabled')) return;
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    if (autorotateToggleElement.classList.contains('enabled')) {
      autorotateToggleElement.classList.remove('enabled');
      stopAutorotate();
    } else {
      autorotateToggleElement.classList.add('enabled');
      startAutorotate();
    }
  }

  // ── Fullscreen ──────────────────────────────────────────────────
  if (screenfull.enabled && data.settings.fullscreenButton) {
    document.body.classList.add('fullscreen-enabled');
    fullscreenToggleElement.addEventListener('click', function() {
      screenfull.toggle();
    });
    screenfull.on('change', function() {
      if (screenfull.isFullscreen) {
        fullscreenToggleElement.classList.add('enabled');
      } else {
        fullscreenToggleElement.classList.remove('enabled');
      }
    });
  } else {
    document.body.classList.add('fullscreen-disabled');
  }

  // ── Scene list toggle ───────────────────────────────────────────
  sceneListToggleElement.addEventListener('click', toggleSceneList);
  if (!document.body.classList.contains('mobile')) {
    showSceneList();
  }

  scenes.forEach(function(scene) {
    var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
    el.addEventListener('click', function() {
      switchScene(scene);
      if (document.body.classList.contains('mobile')) {
        hideSceneList();
      }
    });
  });

  // ── View control buttons ────────────────────────────────────────
  var viewUpElement = document.querySelector('#viewUp');
  var viewDownElement = document.querySelector('#viewDown');
  var viewLeftElement = document.querySelector('#viewLeft');
  var viewRightElement = document.querySelector('#viewRight');
  var viewInElement = document.querySelector('#viewIn');
  var viewOutElement = document.querySelector('#viewOut');

  var velocity = 0.5;
  var friction = 2.5;

  var controls = viewer.controls();
  controls.registerMethod('upElement',    new Marzipano.ElementPressControlMethod(viewUpElement,     'y', -velocity, friction), true);
  controls.registerMethod('downElement',  new Marzipano.ElementPressControlMethod(viewDownElement,   'y',  velocity, friction), true);
  controls.registerMethod('leftElement',  new Marzipano.ElementPressControlMethod(viewLeftElement,   'x', -velocity, friction), true);
  controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement,  'x',  velocity, friction), true);
  controls.registerMethod('inElement',    new Marzipano.ElementPressControlMethod(viewInElement,  'zoom', -velocity, friction), true);
  controls.registerMethod('outElement',   new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom',  velocity, friction), true);

  // ── Utility functions ───────────────────────────────────────────
  function sanitize(s) {
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) return scenes[i];
    }
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) return data.scenes[i];
    }
    return null;
  }

  function stopTouchAndScrollEventPropagation(element) {
    var eventList = ['touchstart', 'touchmove', 'touchend', 'touchcancel',
                     'wheel', 'mousewheel'];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function(event) {
        event.stopPropagation();
      });
    }
  }

  // ── Link hotspot element ────────────────────────────────────────
  function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('link-hotspot');

    // Marker background (oval, breathing, no rotation)
    var marker = document.createElement('div');
    marker.classList.add('link-hotspot-marker');

    // Arrow icon (image with rotation applied by JS)
    var icon = document.createElement('img');
    icon.src = 'img/link.png';
    icon.classList.add('link-hotspot-icon');

    // Set rotation on the icon
    var transformProperties = ['-ms-transform', '-webkit-transform', 'transform'];
    for (var i = 0; i < transformProperties.length; i++) {
      var property = transformProperties[i];
      icon.style[property] = 'rotate(' + hotspot.rotation + 'rad)';
    }

    marker.appendChild(icon);
    wrapper.appendChild(marker);

    // Preload on hover
    wrapper.addEventListener('mouseenter', function() {
      preloadSceneTiles(hotspot.target);
    });
    wrapper.addEventListener('touchstart', function() {
      preloadSceneTiles(hotspot.target);
    }, { passive: true });

    // Click: switch scene
    wrapper.addEventListener('click', function() {
      var target = findSceneById(hotspot.target);
      if (target) {
        switchScene(target, hotspot.yaw);
      }
    });

    stopTouchAndScrollEventPropagation(wrapper);

    // Tooltip
    var tooltip = document.createElement('div');
    tooltip.classList.add('hotspot-tooltip');
    tooltip.classList.add('link-hotspot-tooltip');
    tooltip.innerHTML = findSceneDataById(hotspot.target).name;
    wrapper.appendChild(tooltip);

    return wrapper;
  }

  // ── Info hotspot element ────────────────────────────────────────
  function createInfoHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('info-hotspot');

    var header = document.createElement('div');
    header.classList.add('info-hotspot-header');

    var iconWrapper = document.createElement('div');
    iconWrapper.classList.add('info-hotspot-icon-wrapper');
    var icon = document.createElement('img');
    icon.src = 'img/info.png';
    icon.classList.add('info-hotspot-icon');
    iconWrapper.appendChild(icon);

    var titleWrapper = document.createElement('div');
    titleWrapper.classList.add('info-hotspot-title-wrapper');
    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.innerHTML = hotspot.title;
    titleWrapper.appendChild(title);

    var closeWrapper = document.createElement('div');
    closeWrapper.classList.add('info-hotspot-close-wrapper');
    var closeIcon = document.createElement('img');
    closeIcon.src = 'img/close.png';
    closeIcon.classList.add('info-hotspot-close-icon');
    closeWrapper.appendChild(closeIcon);

    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);

    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.innerHTML = hotspot.text;

    wrapper.appendChild(header);
    wrapper.appendChild(text);

    var modal = document.createElement('div');
    modal.innerHTML = wrapper.innerHTML;
    modal.classList.add('info-hotspot-modal');
    document.body.appendChild(modal);

    var toggle = function() {
      wrapper.classList.toggle('visible');
      modal.classList.toggle('visible');
    };

    wrapper.querySelector('.info-hotspot-header').addEventListener('click', toggle);
    modal.querySelector('.info-hotspot-close-wrapper').addEventListener('click', toggle);

    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  // ── Initial scene load ──────────────────────────────────────────
  switchScene(scenes[0]);
  setTimeout(function() {
    preloadAdjacent(scenes[0].data.id);
  }, 1000);

})();
