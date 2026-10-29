/* Temperbyte mascot (working name "Byte"): a soft rounded cube with a dark glass face screen,
   glowing LED eyes, stubby arms and legs and a little forge flame on top. Real 3D (three.js r149).
   createStage(canvas, opts) -> {renderer, scene, camera, byte, render(state)}            */
(function () {
  const T = THREE;
  if (T.ColorManagement) T.ColorManagement.legacyMode = false;  // hex colors are sRGB

  // ---------------------------------------------------------------- geometry helpers --
  function roundedBox(w, h, d, r, seg) {
    const g = new T.BoxGeometry(w, h, d, seg, seg, seg);
    const p = g.attributes.position, n = g.attributes.normal;
    const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
    const v = new T.Vector3(), c = new T.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      c.set(Math.max(-hx, Math.min(hx, v.x)), Math.max(-hy, Math.min(hy, v.y)), Math.max(-hz, Math.min(hz, v.z)));
      v.sub(c);
      if (v.lengthSq() < 1e-12) v.set(0, 0, 1);
      v.normalize();
      n.setXYZ(i, v.x, v.y, v.z);
      p.setXYZ(i, c.x + v.x * r, c.y + v.y * r, c.z + v.z * r);
    }
    return g;
  }

  function roundRectShape(w, h, r) {
    const s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  // a soft studio environment for reflections (like three's RoomEnvironment, simplified)
  function studioEnv(renderer) {
    const sc = new T.Scene();
    const room = new T.Mesh(new T.BoxGeometry(10, 10, 10), new T.MeshStandardMaterial({ side: T.BackSide, color: 0x6a6a70, roughness: 1 }));
    sc.add(room);
    const panel = (x, y, z, sx, sy, sz, inten, col) => {
      const m = new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshBasicMaterial({ color: new T.Color(col || 0xffffff).multiplyScalar(inten) }));
      m.position.set(x, y, z); m.scale.set(sx, sy, sz); sc.add(m);
    };
    panel(0, 4.9, 0, 6, 0.1, 4, 7);          // big softbox above
    panel(-4.9, 1.5, 1, 0.1, 3, 3, 4);       // left
    panel(4.9, 1, -1, 0.1, 2.5, 2.5, 3, 0xffd6b8);  // warm right
    panel(0, 1.2, 4.9, 4, 2, 0.1, 2.2);      // front fill
    panel(0, 2.5, -4.9, 5, 1.2, 0.1, 5, 0xb9d4ff); // cool back rim
    const pm = new T.PMREMGenerator(renderer);
    const env = pm.fromScene(sc, 0.04).texture;
    pm.dispose();
    return env;
  }

  // ---------------------------------------------------------------- the face screen --
  const FACE_W = 512, FACE_H = 320;
  function drawFace(ctx, s) {
    const W = FACE_W, H = FACE_H;
    ctx.clearRect(0, 0, W, H);
    const col = s.eyeColor || "#FFE7C2";
    ctx.save();
    ctx.shadowColor = s.glowColor || "rgba(255,170,90,0.95)";
    ctx.shadowBlur = 46;
    ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const lx = W * 0.32 + (s.lookX || 0) * 40, rx = W * 0.68 + (s.lookX || 0) * 40;
    const ey = H * 0.46 - (s.lookY || 0) * 30;
    const blink = s.blink || 0; // 0 open .. 1 closed
    const e = s.expr || "neutral";
    const pill = (x, y, w, h) => {
      h = Math.max(10, h * (1 - blink));
      const r = Math.min(w, h) / 2;
      ctx.beginPath(); ctx.moveTo(x - w / 2 + r, y - h / 2);
      ctx.arcTo(x + w / 2, y - h / 2, x + w / 2, y + h / 2, r); ctx.arcTo(x + w / 2, y + h / 2, x - w / 2, y + h / 2, r);
      ctx.arcTo(x - w / 2, y + h / 2, x - w / 2, y - h / 2, r); ctx.arcTo(x - w / 2, y - h / 2, x + w / 2, y - h / 2, r);
      ctx.fill();
    };
    const arc = (x, y, w, up) => { ctx.lineWidth = 26; ctx.beginPath();
      if (up) ctx.arc(x, y + w * 0.35, w * 0.5, Math.PI * 1.15, Math.PI * 1.85); else ctx.arc(x, y - w * 0.35, w * 0.5, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke(); };
    const heart = (x, y, sz) => { ctx.beginPath(); ctx.moveTo(x, y + sz * 0.55);
      ctx.bezierCurveTo(x - sz * 1.1, y - sz * 0.1, x - sz * 0.5, y - sz * 0.95, x, y - sz * 0.35);
      ctx.bezierCurveTo(x + sz * 0.5, y - sz * 0.95, x + sz * 1.1, y - sz * 0.1, x, y + sz * 0.55); ctx.fill(); };
    if (e === "happy") { arc(lx, ey, 92, true); arc(rx, ey, 92, true); }
    else if (e === "love") { heart(lx, ey, 62); heart(rx, ey, 62); }
    else if (e === "shock") { ctx.lineWidth = 20; ctx.beginPath(); ctx.arc(lx, ey, 44, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(rx, ey, 44, 0, 7); ctx.stroke();
      pill(lx, ey, 18, 18); pill(rx, ey, 18, 18); }
    else if (e === "angry") { pill(lx, ey + 10, 64, 84); pill(rx, ey + 10, 64, 84);
      ctx.save(); ctx.shadowBlur = 0; ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); ctx.moveTo(lx - 70, ey - 90); ctx.lineTo(lx + 70, ey - 90); ctx.lineTo(lx + 70, ey + 22); ctx.lineTo(lx - 70, ey - 44); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(rx + 70, ey - 90); ctx.lineTo(rx - 70, ey - 90); ctx.lineTo(rx - 70, ey + 22); ctx.lineTo(rx + 70, ey - 44); ctx.closePath(); ctx.fill(); ctx.restore(); }
    else if (e === "smug") { pill(lx, ey + 6, 70, 40); pill(rx, ey + 6, 70, 40);
      ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(lx - 44, ey - 34); ctx.lineTo(lx + 40, ey - 26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx - 40, ey - 26); ctx.lineTo(rx + 44, ey - 34); ctx.stroke(); }
    else if (e === "wink") { pill(lx, ey, 60, 96); arc(rx, ey + 6, 84, false); }
    else if (e === "sad") { pill(lx, ey + 8, 58, 74); pill(rx, ey + 8, 58, 74);
      ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(lx - 40, ey - 40); ctx.lineTo(lx + 36, ey - 58); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx - 36, ey - 58); ctx.lineTo(rx + 40, ey - 40); ctx.stroke(); }
    else if (e === "money") { ctx.font = "bold 128px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("$", lx, ey + 6); ctx.fillText("$", rx, ey + 6); }
    else if (e === "load") { ctx.lineWidth = 18; const r0 = (s.t || 0) * 9;
      for (const x of [lx, rx]) { ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(x, ey, 42, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(x, ey, 42, r0, r0 + 2.2); ctx.stroke(); } }
    else if (e === "dead") { ctx.lineWidth = 20; for (const x of [lx, rx]) { ctx.beginPath(); ctx.moveTo(x - 34, ey - 34); ctx.lineTo(x + 34, ey + 34);
      ctx.moveTo(x + 34, ey - 34); ctx.lineTo(x - 34, ey + 34); ctx.stroke(); } }
    else { pill(lx, ey, 74, 118); pill(rx, ey, 74, 118); }
    // mouth (tiny, optional)
    if (s.mouth === "o") { ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(W / 2, H * 0.83, 16, 0, 7); ctx.stroke(); }
    else if (s.mouth === "smile") { ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(W / 2, H * 0.72, 30, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); }
    else if (s.mouth === "flat") { ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(W / 2 - 26, H * 0.84); ctx.lineTo(W / 2 + 26, H * 0.84); ctx.stroke(); }
    ctx.restore();
    // scanlines for an LED feel
    ctx.save(); ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,0.16)";
    for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 2);
    ctx.restore();
  }

  // ---------------------------------------------------------------- the character --
  function createByte(opts = {}) {
    const body = new T.Color(opts.body || "#C2501F");
    const limb = new T.Color(opts.limb || "#963A14");
    const root = new T.Group();      // position / turn
    const hop = new T.Group();       // bounce + squash
    root.add(hop);
    const bodyMat = new T.MeshPhysicalMaterial({ color: body, roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.35, sheenColor: new T.Color("#ff9d6b"), envMapIntensity: 0.8 });
    const limbMat = new T.MeshPhysicalMaterial({ color: limb, roughness: 0.5, clearcoat: 0.3 });
    const W = 1.0, H = 0.98, D = 0.86;
    const torso = new T.Mesh(roundedBox(W, H, D, 0.24, 10), bodyMat);
    torso.castShadow = true; torso.receiveShadow = true;
    hop.add(torso);

    // face: dark glass screen with a bevel
    const scr = roundRectShape(0.76, 0.5, 0.13);
    const screenGeo = new T.ExtrudeGeometry(scr, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 4, curveSegments: 16 });
    const screenMat = new T.MeshPhysicalMaterial({ color: "#07080a", roughness: 0.22, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.55 });
    const screen = new T.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.06, D / 2 - 0.022);
    hop.add(screen);
    const cvs = document.createElement("canvas"); cvs.width = FACE_W; cvs.height = FACE_H;
    const fctx = cvs.getContext("2d");
    const ftex = new T.CanvasTexture(cvs); ftex.encoding = T.sRGBEncoding;
    const face = new T.Mesh(new T.PlaneGeometry(0.74, 0.74 * FACE_H / FACE_W),
      new T.MeshBasicMaterial({ map: ftex, transparent: true, depthWrite: false, toneMapped: false }));
    face.position.set(0, 0.06, D / 2 + 0.024);
    hop.add(face);

    // arms (pivot at the shoulder) and legs
    const mkArm = (side) => {
      const piv = new T.Group(); piv.position.set(side * (W / 2 - 0.01), -0.02, 0.02);
      const a = new T.Mesh(new T.CapsuleGeometry(0.085, 0.17, 8, 16), limbMat);
      a.position.set(side * 0.06, -0.14, 0); a.castShadow = true;
      piv.add(a); hop.add(piv); return piv;
    };
    const armL = mkArm(-1), armR = mkArm(1);
    const legs = [];
    for (const side of [-1, 1]) {
      const l = new T.Mesh(new T.CapsuleGeometry(0.1, 0.06, 8, 16), limbMat);
      l.position.set(side * 0.22, -H / 2 - 0.05, 0.02); l.castShadow = true;
      root.add(l); legs.push(l);
    }

    // forge flame on top: stalk + glowing teardrop
    const flameG = new T.Group(); flameG.position.set(0.0, H / 2 + 0.02, 0); hop.add(flameG);
    const stalk = new T.Mesh(new T.CylinderGeometry(0.022, 0.03, 0.12, 12), limbMat);
    stalk.position.y = 0.05; flameG.add(stalk);
    const pts = [];
    for (let i = 0; i <= 24; i++) { const a = i / 24; const y = a * 0.36;
      const r = 0.105 * Math.pow(Math.sin(Math.PI * Math.min(1, a * 1.25)) , 0.8) * (1 - a * 0.55);
      pts.push(new T.Vector2(Math.max(0.0001, r), y)); }
    const flameGeo = new T.LatheGeometry(pts, 24);
    const flameMat = new T.MeshStandardMaterial({ color: "#ff9a2e", emissive: new T.Color("#ff5e00"), emissiveIntensity: 1.6, roughness: 0.4, transparent: true, opacity: 0.97 });
    const flame = new T.Mesh(flameGeo, flameMat); flame.position.y = 0.09; flameG.add(flame);
    const core = new T.Mesh(new T.SphereGeometry(0.04, 16, 12), new T.MeshBasicMaterial({ color: new T.Color("#ffd27a"), toneMapped: false }));
    core.position.y = 0.15; flameG.add(core);
    const glow = new T.PointLight("#ff8a3a", 0.9, 1.6, 2); glow.position.y = 0.2; flameG.add(glow);
    const hc = document.createElement("canvas"); hc.width = hc.height = 128; const hx = hc.getContext("2d");
    const gr = hx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,190,110,0.85)"); gr.addColorStop(0.35, "rgba(255,120,40,0.35)"); gr.addColorStop(1, "rgba(255,90,20,0)");
    hx.fillStyle = gr; hx.fillRect(0, 0, 128, 128);
    const halo = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(hc), blending: T.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
    halo.scale.set(0.55, 0.55, 1); halo.position.y = 0.17; flameG.add(halo);

    function update(s = {}) {
      const t = s.t || 0;
      // idle breathing + optional bounce
      const bounce = s.bounce || 0;
      const ph = t * (s.bounceRate || 6.0);
      const b = bounce * Math.abs(Math.sin(ph));
      const squash = 1 + (s.squash || 0) - bounce * 0.08 * Math.max(0, Math.cos(ph) * Math.sign(Math.sin(ph))) ;
      hop.position.y = b * 0.25 + Math.sin(t * 2.2) * 0.012;
      hop.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
      root.rotation.y = s.turn || 0;
      root.rotation.z = s.tilt || 0;
      hop.rotation.x = s.nod || 0;
      armL.rotation.z = -(s.armL ?? 0.18) - Math.sin(t * 2.2) * 0.04;
      armR.rotation.z = (s.armR ?? 0.18) + Math.sin(t * 2.2 + 1) * 0.04;
      armL.rotation.x = s.armLx || 0; armR.rotation.x = s.armRx || 0;
      for (const l of legs) l.position.y = -H / 2 - 0.05 + Math.min(0, -0) ;
      // flame flicker
      const fl = s.flame ?? 1;
      const fk = 1 + Math.sin(t * 23) * 0.05 + Math.sin(t * 37 + 1) * 0.04;
      flame.scale.set(fl * (1 + Math.sin(t * 17) * 0.04), fl * fk * (s.flameBoost || 1), fl * (1 + Math.sin(t * 19) * 0.04));
      flame.rotation.z = Math.sin(t * 5) * 0.08;
      flameMat.emissiveIntensity = 1.5 + Math.sin(t * 29) * 0.25 + (s.flameBoost ? (s.flameBoost - 1) * 2 : 0);
      if (s.flameColor) { flameMat.emissive.set(s.flameColor); }
      glow.intensity = 0.9 * fl; halo.material.opacity = 0.8 + Math.sin(t * 21) * 0.15;
      flameG.visible = fl > 0.01;
      drawFace(fctx, s);
      ftex.needsUpdate = true;
    }
    update({});
    return { root, hop, update, parts: { torso, screen, face, armL, armR, legs, flame, flameG } };
  }

  // ---------------------------------------------------------------- the stage --
  function createStage(canvas, opts = {}) {
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(canvas.width, canvas.height, false);
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = opts.exposure || 1.05;
    renderer.physicallyCorrectLights = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    const scene = new T.Scene();
    scene.environment = studioEnv(renderer);
    const camera = new T.PerspectiveCamera(opts.fov || 26, canvas.width / canvas.height, 0.1, 50);
    camera.position.set(0, 0.35, 5.2);
    camera.lookAt(0, 0, 0);
    const key = new T.DirectionalLight("#fff4ea", 1.5);
    key.position.set(-2.2, 4, 3); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.bias = -0.0005;
    Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.5, far: 12 });
    scene.add(key);
    const rim = new T.DirectionalLight(opts.rim || "#7fb2ff", 1.1); rim.position.set(3, 2.2, -3); scene.add(rim);
    const warm = new T.DirectionalLight("#ff9a5c", 0.5); warm.position.set(3, -1, 2); scene.add(warm);
    scene.add(new T.HemisphereLight("#ffffff", "#40302a", 0.25));
    const floor = new T.Mesh(new T.PlaneGeometry(12, 12), new T.ShadowMaterial({ opacity: opts.shadow ?? 0.28 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.62; floor.receiveShadow = true;
    scene.add(floor);
    const byte = createByte(opts);
    scene.add(byte.root);
    function render(state = {}) {
      byte.update(state);
      if (state.cam) { const c = state.cam; camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3] || 0, c[4] || 0, c[5] || 0); }
      floor.visible = state.floor !== false;
      renderer.render(scene, camera);
    }
    return { renderer, scene, camera, byte, floor, render, key, rim };
  }

  window.TB = { createStage, createByte, roundedBox };
})();
