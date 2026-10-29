/* Video kit: a deterministic timeline for 1080x1920 compositions.
   Every page defines window.DURATION, window.SFX (list of [time, name, gain]) and
   window.seek(t) that draws frame t. The renderer calls seek(t) and takes a screenshot. */
(function () {
  const K = {};
  K.W = 1080; K.H = 1920;
  K.clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  K.p = (t, a, b) => K.clamp((t - a) / (b - a));                  // progress 0..1 between a and b
  K.lerp = (a, b, x) => a + (b - a) * x;
  K.E = {
    out3: (x) => 1 - Math.pow(1 - x, 3),
    out5: (x) => 1 - Math.pow(1 - x, 5),
    in3: (x) => x * x * x,
    io3: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    back: (x) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    elastic: (x) => (x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
  };
  // in/out window helper: 0 before a, eases to 1 over dur, stays, then eases back to 0 at b
  K.win = (t, a, b, din = 0.25, dout = 0.2, ein = K.E.out3, eout = K.E.in3) => {
    if (t < a || t > b) return 0;
    const i = ein(K.p(t, a, a + din));
    const o = b - dout <= a ? 1 : 1 - eout(K.p(t, b - dout, b));
    return Math.min(i, o);
  };
  K.el = (tag, cls, parent, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    (parent || document.getElementById("stage")).appendChild(e);
    return e;
  };
  K.css = (e, o) => { for (const k in o) e.style[k] = o[k]; };
  K.show = (e, on) => { e.style.display = on ? "" : "none"; };
  // pseudo-random, stable per seed
  K.rand = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  // camera shake that decays after an impact time
  K.shake = (t, hits, amp = 22, dur = 0.35) => {
    let x = 0, y = 0, r = 0;
    for (const h of hits) {
      const d = t - h;
      if (d >= 0 && d < dur) {
        const k = Math.pow(1 - d / dur, 2) * amp;
        x += Math.sin(d * 90 + h * 7) * k; y += Math.cos(d * 77 + h * 3) * k; r += Math.sin(d * 60 + h) * k * 0.04;
      }
    }
    return { x, y, r };
  };
  // count-up number
  K.count = (t, a, b, from, to, dec = 0) => {
    const v = K.lerp(from, to, K.E.out3(K.p(t, a, b)));
    return v.toFixed(dec);
  };

  // ---------------------------------------------------------- film grain overlay --
  K.grain = (parent) => {
    const c = document.createElement("canvas"); c.width = 540; c.height = 960; c.className = "grain";
    (parent || document.body).appendChild(c);
    const ctx = c.getContext("2d");
    const frames = [];
    for (let f = 0; f < 6; f++) {
      const img = ctx.createImageData(540, 960);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = K.rand(i * 0.013 + f * 17.3) * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
      }
      frames.push(img);
    }
    return (t) => ctx.putImageData(frames[Math.floor(t * 24) % frames.length], 0, 0);
  };

  // ---------------------------------------------------------- wireframe background --
  K.wireBg = (canvas, opts = {}) => {
    const T = THREE;
    const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1); r.setSize(canvas.width, canvas.height, false); r.setClearColor(0, 0);
    const sc = new T.Scene();
    const cam = new T.PerspectiveCamera(40, canvas.width / canvas.height, 0.1, 100); cam.position.set(0, 0, 14);
    const col = new T.Color(opts.color || "#C2501F");
    const shapes = [];
    const mk = (geo, x, y, z, s, op) => {
      const m = new T.LineSegments(new T.WireframeGeometry(geo), new T.LineBasicMaterial({ color: col, transparent: true, opacity: op }));
      m.position.set(x, y, z); m.scale.setScalar(s); sc.add(m); shapes.push(m); return m;
    };
    const list = opts.shapes || [
      [new T.TorusGeometry(1.6, 0.55, 14, 36), -3.2, 5.6, -2, 1.0, 0.55],
      [new T.SphereGeometry(1.8, 18, 12), 3.6, -5.8, -3, 1.0, 0.45],
      [new T.TorusKnotGeometry(1.0, 0.28, 90, 8, 2, 3), 3.4, 3.2, -6, 1.0, 0.3],
      [new T.CylinderGeometry(1.2, 1.2, 3.2, 24, 8, true), -3.8, -3.0, -7, 1.0, 0.28],
      [new T.IcosahedronGeometry(1.4, 1), 0.2, 8.6, -8, 1.0, 0.25],
    ];
    for (const s of list) mk(...s);
    return (t, k = 1, par = {}) => {
      shapes.forEach((m, i) => {
        m.rotation.x = t * (0.15 + i * 0.05) + i;
        m.rotation.y = t * (0.22 - i * 0.03) + i * 2;
        m.material.opacity = list[i][5] * k;
        m.position.y = list[i][2] + (par.drift || 0) * (i % 2 ? 1 : -1) + Math.sin(t * 0.6 + i) * 0.15;
      });
      if (par.color) col.set(par.color);
      r.render(sc, cam);
    };
  };

  // ---------------------------------------------------------- mascot placement --
  // put the mascot so its feet stand at screen point (px, py) with a body height of sizePx
  K.mascotStage = (canvas, opts = {}) => {
    const st = TB.createStage(canvas, Object.assign({ fov: 30 }, opts));
    const cam = st.camera;
    cam.position.set(0, 0, 10); cam.lookAt(0, 0, 0);
    st.renderer.shadowMap.type = THREE.VSMShadowMap;
    st.key.shadow.radius = 14; st.key.shadow.blurSamples = 16;
    Object.assign(st.key.shadow.camera, { left: -8, right: 8, top: 12, bottom: -12, near: 0.5, far: 30 });
    st.key.position.set(-4, 7, 6);
    const visH = 2 * 10 * Math.tan((30 * Math.PI) / 360), visW = visH * canvas.width / canvas.height;
    const toWorld = (px, py) => [(px / canvas.width - 0.5) * visW, (0.5 - py / canvas.height) * visH];
    st.place = (px, py, sizePx, state = {}) => {
      const s = (sizePx / canvas.height) * visH / 1.1;      // body ~1.1 units tall incl. legs
      const [x, y] = toWorld(px, py);
      st.byte.root.position.set(x, y + 0.62 * s, 0);
      st.byte.root.scale.setScalar(s);
      st.floor.position.y = y;
      st.floor.material.opacity = state.shadow ?? 0.35;
      st.byte.root.visible = state.visible !== false;
      st.key.target.position.set(x, y, 0); st.key.target.updateMatrixWorld();
      st.key.position.set(x - 4, y + 7, 6);
      st.render(Object.assign({}, state, { cam: null }));
    };
    return st;
  };

  window.K = K;
})();
