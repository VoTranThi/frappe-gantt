const k = "year", M = "month", D = "day", T = "hour", L = "minute", Y = "second", S = "millisecond", d = {
  parse_duration(r) {
    const e = /([0-9]+)(y|m|d|h|min|s|ms)/gm.exec(r);
    if (e !== null) {
      if (e[2] === "y")
        return { duration: parseInt(e[1]), scale: "year" };
      if (e[2] === "m")
        return { duration: parseInt(e[1]), scale: "month" };
      if (e[2] === "d")
        return { duration: parseInt(e[1]), scale: "day" };
      if (e[2] === "h")
        return { duration: parseInt(e[1]), scale: "hour" };
      if (e[2] === "min")
        return { duration: parseInt(e[1]), scale: "minute" };
      if (e[2] === "s")
        return { duration: parseInt(e[1]), scale: "second" };
      if (e[2] === "ms")
        return { duration: parseInt(e[1]), scale: "millisecond" };
    }
  },
  parse(r, t = "-", e = /[.:]/) {
    if (r instanceof Date)
      return r;
    if (typeof r == "string") {
      let i, s;
      const n = r.split(" ");
      i = n[0].split(t).map((a) => parseInt(a, 10)), s = n[1] && n[1].split(e), i[1] = i[1] ? i[1] - 1 : 0;
      let o = i;
      return s && s.length && (s.length === 4 && (s[3] = "0." + s[3], s[3] = parseFloat(s[3]) * 1e3), o = o.concat(s)), new Date(...o);
    }
  },
  to_string(r, t = !1) {
    if (!(r instanceof Date))
      throw new TypeError("Invalid argument type");
    const e = this.get_date_values(r).map((n, o) => (o === 1 && (n = n + 1), o === 6 ? $(n + "", 3, "0") : $(n + "", 2, "0"))), i = `${e[0]}-${e[1]}-${e[2]}`, s = `${e[3]}:${e[4]}:${e[5]}.${e[6]}`;
    return i + (t ? " " + s : "");
  },
  format(r, t = "YYYY-MM-DD HH:mm:ss.SSS", e = "en") {
    const i = new Intl.DateTimeFormat(e, {
      month: "long"
    }), s = new Intl.DateTimeFormat(e, {
      month: "short"
    }), n = i.format(r), o = n.charAt(0).toUpperCase() + n.slice(1), a = this.get_date_values(r).map((g) => $(g, 2, 0)), h = {
      YYYY: a[0],
      MM: $(+a[1] + 1, 2, 0),
      DD: a[2],
      HH: a[3],
      mm: a[4],
      ss: a[5],
      SSS: a[6],
      D: a[2],
      MMMM: o,
      MMM: s.format(r)
    };
    let l = t;
    const _ = [];
    return Object.keys(h).sort((g, c) => c.length - g.length).forEach((g) => {
      l.includes(g) && (l = l.replaceAll(g, `$${_.length}`), _.push(h[g]));
    }), _.forEach((g, c) => {
      l = l.replaceAll(`$${c}`, g);
    }), l;
  },
  diff(r, t, e = "day") {
    let i, s, n, o, a, h, l;
    i = r - t + (t.getTimezoneOffset() - r.getTimezoneOffset()) * 6e4, s = i / 1e3, o = s / 60, n = o / 60, a = n / 24;
    let _ = r.getFullYear() - t.getFullYear(), g = r.getMonth() - t.getMonth();
    return g += a % 30 / 30, h = _ * 12 + g, r.getDate() < t.getDate() && h--, l = h / 12, e.endsWith("s") || (e += "s"), Math.round(
      {
        milliseconds: i,
        seconds: s,
        minutes: o,
        hours: n,
        days: a,
        months: h,
        years: l
      }[e] * 100
    ) / 100;
  },
  today() {
    const r = this.get_date_values(/* @__PURE__ */ new Date()).slice(0, 3);
    return new Date(...r);
  },
  now() {
    return /* @__PURE__ */ new Date();
  },
  add(r, t, e) {
    t = parseInt(t, 10);
    const i = [
      r.getFullYear() + (e === k ? t : 0),
      r.getMonth() + (e === M ? t : 0),
      r.getDate() + (e === D ? t : 0),
      r.getHours() + (e === T ? t : 0),
      r.getMinutes() + (e === L ? t : 0),
      r.getSeconds() + (e === Y ? t : 0),
      r.getMilliseconds() + (e === S ? t : 0)
    ];
    return new Date(...i);
  },
  start_of(r, t) {
    const e = {
      [k]: 6,
      [M]: 5,
      [D]: 4,
      [T]: 3,
      [L]: 2,
      [Y]: 1,
      [S]: 0
    };
    function i(n) {
      const o = e[t];
      return e[n] <= o;
    }
    const s = [
      r.getFullYear(),
      i(k) ? 0 : r.getMonth(),
      i(M) ? 1 : r.getDate(),
      i(D) ? 0 : r.getHours(),
      i(T) ? 0 : r.getMinutes(),
      i(L) ? 0 : r.getSeconds(),
      i(Y) ? 0 : r.getMilliseconds()
    ];
    return new Date(...s);
  },
  clone(r) {
    return new Date(...this.get_date_values(r));
  },
  get_date_values(r) {
    return [
      r.getFullYear(),
      r.getMonth(),
      r.getDate(),
      r.getHours(),
      r.getMinutes(),
      r.getSeconds(),
      r.getMilliseconds()
    ];
  },
  convert_scales(r, t) {
    const e = {
      millisecond: 11574074074074074e-24,
      second: 11574074074074073e-21,
      minute: 6944444444444445e-19,
      hour: 0.041666666666666664,
      day: 1,
      month: 30,
      year: 365
    }, { duration: i, scale: s } = this.parse_duration(r);
    return i * e[s] / e[t];
  },
  get_days_in_month(r) {
    const t = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], e = r.getMonth();
    if (e !== 1)
      return t[e];
    const i = r.getFullYear();
    return i % 4 === 0 && i % 100 != 0 || i % 400 === 0 ? 29 : 28;
  },
  get_days_in_year(r) {
    return r.getFullYear() % 4 ? 365 : 366;
  }
};
function $(r, t, e) {
  return r = r + "", t = t >> 0, e = String(typeof e < "u" ? e : " "), r.length > t ? String(r) : (t = t - r.length, t > e.length && (e += e.repeat(t / e.length)), e.slice(0, t) + String(r));
}
function p(r, t) {
  return typeof r == "string" ? (t || document).querySelector(r) : r || null;
}
function f(r, t) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", r);
  for (let i in t)
    i === "append_to" ? t.append_to.appendChild(e) : i === "innerHTML" ? e.innerHTML = t.innerHTML : i === "clipPath" ? e.setAttribute("clip-path", "url(#" + t[i] + ")") : e.setAttribute(i, t[i]);
  return e;
}
function x(r, t, e, i) {
  const s = W(r, t, e, i);
  if (s === r) {
    const n = document.createEvent("HTMLEvents");
    n.initEvent("click", !0, !0), n.eventName = "click", s.dispatchEvent(n);
  }
}
function W(r, t, e, i, s = "0.4s", n = "0.1s") {
  const o = r.querySelector("animate");
  if (o)
    return p.attr(o, {
      attributeName: t,
      from: e,
      to: i,
      dur: s,
      begin: "click + " + n
      // artificial click
    }), r;
  const a = f("animate", {
    attributeName: t,
    from: e,
    to: i,
    dur: s,
    begin: n,
    calcMode: "spline",
    values: e + ";" + i,
    keyTimes: "0; 1",
    keySplines: C("ease-out")
  });
  return r.appendChild(a), r;
}
function C(r) {
  return {
    ease: ".25 .1 .25 1",
    linear: "0 0 1 1",
    "ease-in": ".42 0 1 1",
    "ease-out": "0 0 .58 1",
    "ease-in-out": ".42 0 .58 1"
  }[r];
}
p.on = (r, t, e, i) => {
  i ? p.delegate(r, t, e, i) : (i = e, p.bind(r, t, i));
};
p.off = (r, t, e) => {
  r.removeEventListener(t, e);
};
p.bind = (r, t, e) => {
  t.split(/\s+/).forEach(function(i) {
    r.addEventListener(i, e);
  });
};
p.delegate = (r, t, e, i) => {
  r.addEventListener(t, function(s) {
    const n = s.target.closest(e);
    n && (s.delegatedTarget = n, i.call(this, s, n));
  });
};
p.closest = (r, t) => t ? t.matches(r) ? t : p.closest(r, t.parentNode) : null;
p.attr = (r, t, e) => {
  if (!e && typeof t == "string")
    return r.getAttribute(t);
  if (typeof t == "object") {
    for (let i in t)
      p.attr(r, i, t[i]);
    return;
  }
  r.setAttribute(t, e);
};
class q {
  constructor(t, e, i) {
    this.gantt = t, this.from_task = e, this.to_task = i, this.calculate_path(), this.draw();
  }
  calculate_path() {
    let t = this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;
    const e = () => this.to_task.$bar.getX() < t + this.gantt.options.padding && t > this.from_task.$bar.getX() + this.gantt.options.padding;
    for (; e(); )
      t -= 10;
    t -= 10;
    let i = this.gantt.config.header_height + this.gantt.options.bar_height + (this.gantt.options.padding + this.gantt.options.bar_height) * this.from_task.task._index + this.gantt.options.padding / 2, s = this.to_task.$bar.getX() - 13, n = this.gantt.config.header_height + this.gantt.options.bar_height / 2 + (this.gantt.options.padding + this.gantt.options.bar_height) * this.to_task.task._index + this.gantt.options.padding / 2;
    const o = this.from_task.task._index > this.to_task.task._index;
    let a = this.gantt.options.arrow_curve;
    const h = o ? 1 : 0;
    let l = o ? -a : a;
    if (this.to_task.$bar.getX() <= this.from_task.$bar.getX() + this.gantt.options.padding) {
      let _ = this.gantt.options.padding / 2 - a;
      _ < 0 && (_ = 0, a = this.gantt.options.padding / 2, l = o ? -a : a);
      const g = this.to_task.$bar.getY() + this.to_task.$bar.getHeight() / 2 - l, c = this.to_task.$bar.getX() - this.gantt.options.padding;
      this.path = `
                M ${t} ${i}
                v ${_}
                a ${a} ${a} 0 0 1 ${-a} ${a}
                H ${c}
                a ${a} ${a} 0 0 ${h} ${-a} ${l}
                V ${g}
                a ${a} ${a} 0 0 ${h} ${a} ${l}
                L ${s} ${n}
                m -5 -5
                l 5 5
                l -5 5`;
    } else {
      s < t + a && (a = s - t);
      let _ = o ? n + a : n - a;
      this.path = `
              M ${t} ${i}
              V ${_}
              a ${a} ${a} 0 0 ${h} ${a} ${a}
              L ${s} ${n}
              m -5 -5
              l 5 5
              l -5 5`;
    }
  }
  draw() {
    this.element = f("path", {
      d: this.path,
      "data-from": this.from_task.task.id,
      "data-to": this.to_task.task.id
    });
  }
  update() {
    this.calculate_path(), this.element.setAttribute("d", this.path);
  }
}
class F {
  constructor(t, e) {
    this.set_defaults(t, e), this.prepare_wrappers(), this.prepare_helpers(), this.refresh();
  }
  refresh() {
    this.bar_group.innerHTML = "", this.handle_group.innerHTML = "", this.task.custom_class ? this.group.classList.add(this.task.custom_class) : this.group.classList = ["bar-wrapper"], this.prepare_values(), this.draw(), this.bind();
  }
  set_defaults(t, e) {
    this.action_completed = !1, this.gantt = t, this.task = e, this.name = this.name || "";
  }
  prepare_wrappers() {
    this.group = f("g", {
      class: "bar-wrapper" + (this.task.custom_class ? " " + this.task.custom_class : ""),
      "data-id": this.task.id
    }), this.bar_group = f("g", {
      class: "bar-group",
      append_to: this.group
    }), this.handle_group = f("g", {
      class: "handle-group",
      append_to: this.group
    });
  }
  prepare_values() {
    this.invalid = this.task.invalid, this.height = this.gantt.options.bar_height, this.image_size = this.height - 5, this.task._start || (this.task._start = new Date(this.task.start)), this.task._end = new Date(this.task.end), this.task.baseline && (this.task._baseline_start || (this.task._baseline_start = new Date(this.task.baseline_start)), this.task._baseline_end = new Date(this.task.baseline_end)), this.compute_x(), this.compute_y(), this.compute_duration(), this.compute_baseline_duration(), this.corner_radius = this.gantt.options.bar_corner_radius, this.width = this.gantt.config.column_width * this.duration, (!this.task.progress || this.task.progress < 0) && (this.task.progress = 0), this.task.progress > 100 && (this.task.progress = 100), this.task.baseline && (this.baseline_width = this.gantt.config.column_width * this.baseline_duration, this.task.baseline_progress || (this.task.baseline_progress = 0), this.task.baseline_progress = Math.max(Math.min(this.task.baseline_progress, 100), 0));
  }
  prepare_helpers() {
    SVGElement.prototype.getX = function() {
      return +this.getAttribute("x");
    }, SVGElement.prototype.getY = function() {
      return +this.getAttribute("y");
    }, SVGElement.prototype.getWidth = function() {
      return +this.getAttribute("width");
    }, SVGElement.prototype.getHeight = function() {
      return +this.getAttribute("height");
    }, SVGElement.prototype.getEndX = function() {
      return this.getX() + this.getWidth();
    };
  }
  prepare_expected_progress_values() {
    this.compute_expected_progress(), this.expected_progress_width = this.gantt.options.column_width * this.duration * (this.expected_progress / 100) || 0;
  }
  draw() {
    this.draw_bar(), this.draw_progress_bar(), this.gantt.options.show_expected_progress && (this.prepare_expected_progress_values(), this.draw_expected_progress_bar()), this.draw_label(), this.draw_resize_handles(), this.task.thumbnail && this.draw_thumbnail(), this.gantt.options.show_baseline && this.draw_baselinebar();
  }
  draw_bar() {
    this.$bar = f("rect", {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "bar",
      append_to: this.bar_group
    }), this.task.color && (this.$bar.style.fill = this.task.color), x(this.$bar, "width", 0, this.width), this.invalid && this.$bar.classList.add("bar-invalid");
  }
  draw_baselinebar() {
    this.task.baseline && (this.$bar_baseline = f("rect", {
      x: this.baseline_x,
      y: this.baseline_y,
      width: this.baseline_width,
      height: 10,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "bar baseline",
      append_to: this.bar_group
    }), this.task.baseline_color ? this.$bar_baseline.style.fill = this.task.baseline_color : this.$bar_baseline.style.fill = "#b686ea", x(this.$bar_baseline, "width", 0, this.baseline_width));
  }
  draw_expected_progress_bar() {
    this.invalid || (this.$expected_bar_progress = f("rect", {
      x: this.x,
      y: this.y,
      width: this.expected_progress_width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "bar-expected-progress",
      append_to: this.bar_group
    }), x(
      this.$expected_bar_progress,
      "width",
      0,
      this.expected_progress_width
    ));
  }
  draw_progress_bar() {
    if (this.invalid) return;
    this.progress_width = this.calculate_progress_width();
    let t = this.corner_radius;
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (t = this.corner_radius + 2), this.$bar_progress = f("rect", {
      x: this.x,
      y: this.y,
      width: this.progress_width,
      height: this.height,
      rx: t,
      ry: t,
      class: "bar-progress",
      append_to: this.bar_group
    }), this.task.color_progress && (this.$bar_progress.style.fill = this.task.color);
    const e = d.diff(
      this.task._start,
      this.gantt.gantt_start,
      this.gantt.config.unit
    ) / this.gantt.config.step * this.gantt.config.column_width;
    let i = this.gantt.create_el({
      classes: `date-range-highlight hide highlight-${this.task.id}`,
      width: this.width,
      left: e
    });
    this.$date_highlight = i, this.gantt.$lower_header.prepend(this.$date_highlight), x(this.$bar_progress, "width", 0, this.progress_width);
  }
  calculate_progress_width() {
    const t = this.$bar.getWidth(), e = this.x + t, i = this.gantt.config.ignored_positions.reduce((h, l) => h + (l >= this.x && l < e), 0) * this.gantt.config.column_width;
    let s = (t - i) * this.task.progress / 100;
    const n = this.x + s, o = this.gantt.config.ignored_positions.reduce((h, l) => h + (l >= this.x && l < n), 0) * this.gantt.config.column_width;
    s += o;
    let a = this.gantt.get_ignored_region(
      this.x + s
    );
    for (; a.length; )
      s += this.gantt.config.column_width, a = this.gantt.get_ignored_region(
        this.x + s
      );
    return this.progress_width = s, s;
  }
  draw_label() {
    let t = this.x + this.$bar.getWidth() / 2;
    this.task.thumbnail && (t = this.x + this.image_size + 5), f("text", {
      x: t,
      y: this.y + this.height / 2,
      innerHTML: this.task.name,
      class: "bar-label",
      append_to: this.bar_group
    }), requestAnimationFrame(() => this.update_label_position());
  }
  draw_thumbnail() {
    let t = 10, e = 2, i, s;
    i = f("defs", {
      append_to: this.bar_group
    }), f("rect", {
      id: "rect_" + this.task.id,
      x: this.x + t,
      y: this.y + e,
      width: this.image_size,
      height: this.image_size,
      rx: "15",
      class: "img_mask",
      append_to: i
    }), s = f("clipPath", {
      id: "clip_" + this.task.id,
      append_to: i
    }), f("use", {
      href: "#rect_" + this.task.id,
      append_to: s
    }), f("image", {
      x: this.x + t,
      y: this.y + e,
      width: this.image_size,
      height: this.image_size,
      class: "bar-img",
      href: this.task.thumbnail,
      clipPath: "clip_" + this.task.id,
      append_to: this.bar_group
    });
  }
  draw_resize_handles() {
    if (this.invalid || this.gantt.options.readonly) return;
    const t = this.$bar, e = 3;
    if (this.handles = [], this.gantt.options.readonly_dates || (this.handles.push(
      f("rect", {
        x: t.getEndX() - e / 2,
        y: t.getY() + this.height / 4,
        width: e,
        height: this.height / 2,
        rx: 2,
        ry: 2,
        class: "handle right",
        append_to: this.handle_group
      })
    ), this.handles.push(
      f("rect", {
        x: t.getX() - e / 2,
        y: t.getY() + this.height / 4,
        width: e,
        height: this.height / 2,
        rx: 2,
        ry: 2,
        class: "handle left",
        append_to: this.handle_group
      })
    )), !this.gantt.options.readonly_progress) {
      const i = this.$bar_progress;
      this.$handle_progress = f("circle", {
        cx: i.getEndX(),
        cy: i.getY() + i.getHeight() / 2,
        r: 4.5,
        class: "handle progress",
        append_to: this.handle_group
      }), this.handles.push(this.$handle_progress);
    }
    for (let i of this.handles)
      p.on(i, "mouseenter", () => i.classList.add("active")), p.on(i, "mouseleave", () => i.classList.remove("active"));
  }
  bind() {
    this.invalid || this.setup_click_event();
  }
  setup_click_event() {
    let t = this.task.id;
    p.on(this.group, "mouseover", (i) => {
      this.gantt.trigger_event("hover", [
        this.task,
        i.screenX,
        i.screenY,
        i
      ]);
    }), this.gantt.options.popup_on === "click" && p.on(this.group, "mouseup", (i) => {
      const s = i.offsetX || i.layerX;
      if (this.$handle_progress) {
        const n = +this.$handle_progress.getAttribute("cx");
        if (n > s - 1 && n < s + 1 || this.gantt.bar_being_dragged) return;
      }
      this.gantt.show_popup({
        x: i.offsetX || i.layerX,
        y: i.offsetY || i.layerY,
        task: this.task,
        target: this.$bar
      });
    });
    let e;
    p.on(this.group, "mouseenter", (i) => {
      e = setTimeout(() => {
        this.gantt.options.popup_on === "hover" && this.gantt.show_popup({
          x: i.offsetX || i.layerX,
          y: i.offsetY || i.layerY,
          task: this.task,
          target: this.$bar
        }), this.gantt.$container.querySelector(`.highlight-${t}`).classList.remove("hide");
      }, 200);
    }), p.on(this.group, "mouseleave", () => {
      var i, s;
      clearTimeout(e), this.gantt.options.popup_on === "hover" && ((s = (i = this.gantt.popup) == null ? void 0 : i.hide) == null || s.call(i)), this.gantt.$container.querySelector(`.highlight-${t}`).classList.add("hide");
    }), p.on(this.group, "click", () => {
      this.gantt.trigger_event("click", [this.task]);
    }), p.on(this.group, "dblclick", (i) => {
      this.action_completed || (this.group.classList.remove("active"), this.gantt.popup && this.gantt.popup.parent.classList.remove("hide"), this.gantt.trigger_event("double_click", [this.task]));
    });
  }
  update_bar_position({ x: t = null, width: e = null }) {
    const i = this.$bar;
    if (t) {
      if (!this.task.dependencies.map((o) => this.gantt.get_bar(o).$bar.getX()).reduce((o, a) => o && t >= a, !0)) return;
      this.update_attr(i, "x", t), this.x = t, this.$date_highlight.style.left = t + "px";
    }
    e > 0 && (this.update_attr(i, "width", e), this.$date_highlight.style.width = e + "px"), this.update_label_position(), this.update_handle_position(), this.date_changed(), this.compute_duration(), this.gantt.options.show_baseline && this.compute_baseline_duration(), this.gantt.options.show_expected_progress && this.update_expected_progressbar_position(), this.update_progressbar_position(), this.update_arrow_position();
  }
  update_label_position_on_horizontal_scroll({ x: t, sx: e }) {
    const i = this.gantt.$container.querySelector(".gantt-container"), s = this.group.querySelector(".bar-label"), n = this.group.querySelector(".bar-img") || "", o = this.bar_group.querySelector(".img_mask") || "";
    let a = this.$bar.getX() + this.$bar.getWidth(), h = s.getX() + t, l = n && n.getX() + t || 0, _ = n && n.getBBox().width + 7 || 7, g = h + s.getBBox().width + 7, c = e + i.clientWidth / 2;
    s.classList.contains("big") || (g < a && t > 0 && g < c || h - _ > this.$bar.getX() && t < 0 && g > c) && (s.setAttribute("x", h), n && (n.setAttribute("x", l), o.setAttribute("x", l)));
  }
  date_changed() {
    let t = !1;
    const { new_start_date: e, new_end_date: i } = this.compute_start_end_date();
    Number(this.task._start) !== Number(e) && (t = !0, this.task._start = e), Number(this.task._end) !== Number(i) && (t = !0, this.task._end = i), t && this.gantt.trigger_event("date_change", [
      this.task,
      e,
      d.add(i, -1, "second")
    ]);
  }
  progress_changed() {
    this.task.progress = this.compute_progress(), this.gantt.trigger_event("progress_change", [
      this.task,
      this.task.progress
    ]);
  }
  set_action_completed() {
    this.action_completed = !0, setTimeout(() => this.action_completed = !1, 1e3);
  }
  compute_start_end_date() {
    const t = this.$bar, e = t.getX() / this.gantt.config.column_width;
    let i = d.add(
      this.gantt.gantt_start,
      e * this.gantt.config.step,
      this.gantt.config.unit
    );
    const s = t.getWidth() / this.gantt.config.column_width, n = d.add(
      i,
      s * this.gantt.config.step,
      this.gantt.config.unit
    );
    return { new_start_date: i, new_end_date: n };
  }
  compute_progress() {
    this.progress_width = this.$bar_progress.getWidth(), this.x = this.$bar_progress.getBBox().x;
    const t = this.x + this.progress_width, e = this.progress_width - this.gantt.config.ignored_positions.reduce((s, n) => s + (n >= this.x && n <= t), 0) * this.gantt.config.column_width;
    if (e < 0) return 0;
    const i = this.$bar.getWidth() - this.ignored_duration_raw * this.gantt.config.column_width;
    return parseInt(e / i * 100, 10);
  }
  compute_expected_progress() {
    this.expected_progress = d.diff(d.today(), this.task._start, "hour") / this.gantt.config.step, this.expected_progress = (this.expected_progress < this.duration ? this.expected_progress : this.duration) * 100 / this.duration;
  }
  compute_x() {
    const { column_width: t } = this.gantt.config, e = this.task._start, i = this.gantt.gantt_start;
    let n = d.diff(e, i, this.gantt.config.unit) / this.gantt.config.step * t;
    if (this.x = n, this.task.baseline) {
      const o = this.task._baseline_start, a = d.diff(o, i, this.gantt.config.unit) / this.gantt.config.step;
      this.baseline_x = a * t;
    }
  }
  compute_y() {
    this.y = this.gantt.config.header_height + this.gantt.options.padding / 2 + this.task._index * (this.height + this.gantt.options.padding), this.task.baseline && this.gantt.options.show_baseline && (this.baseline_y = this.gantt.config.header_height + this.gantt.options.padding / 2 + this.task._index * (this.height + this.gantt.options.padding), this.baseline_y = this.baseline_y + this.height - 4);
  }
  compute_duration() {
    let t = 0, e = 0;
    for (let i = new Date(this.task._start); i < this.task._end; i.setDate(i.getDate() + 1))
      e++, !this.gantt.config.ignored_dates.find(
        (s) => s.getTime() === i.getTime()
      ) && (!this.gantt.config.ignored_function || !this.gantt.config.ignored_function(i)) && t++;
    this.task.actual_duration = t, this.task.ignored_duration = e - t, this.duration = d.convert_scales(
      e + "d",
      this.gantt.config.unit
    ) / this.gantt.config.step, this.actual_duration_raw = d.convert_scales(
      t + "d",
      this.gantt.config.unit
    ) / this.gantt.config.step, this.ignored_duration_raw = this.duration - this.actual_duration_raw;
  }
  compute_baseline_duration() {
    if (!this.task.baseline || !this.gantt.options.show_baseline)
      return;
    let t = 0, e = 0;
    for (let i = new Date(this.task._baseline_start); i < this.task._baseline_end; i.setDate(i.getDate() + 1))
      e++, !this.gantt.config.ignored_dates.find(
        (s) => s.getTime() === i.getTime()
      ) && (!this.gantt.config.ignored_function || !this.gantt.config.ignored_function(i)) && t++;
    this.task.actual_baseline_duration = t, this.task.ignored_baseline_duration = e - t, this.baseline_duration = d.convert_scales(
      e + "d",
      this.gantt.config.unit
    ) / this.gantt.config.step, this.actual_baseline_duration_raw = d.convert_scales(
      t + "d",
      this.gantt.config.unit
    ) / this.gantt.config.step, this.ignored_baseline_duration_raw = this.baseline_duration - this.actual_baseline_duration_raw;
  }
  update_attr(t, e, i) {
    return i = +i, isNaN(i) || t.setAttribute(e, i), t;
  }
  update_expected_progressbar_position() {
    this.invalid || (this.$expected_bar_progress.setAttribute("x", this.$bar.getX()), this.compute_expected_progress(), this.$expected_bar_progress.setAttribute(
      "width",
      this.gantt.config.column_width * this.actual_duration_raw * (this.expected_progress / 100) || 0
    ));
  }
  update_progressbar_position() {
    this.invalid || this.gantt.options.readonly || (this.$bar_progress.setAttribute("x", this.$bar.getX()), this.$bar_progress.setAttribute(
      "width",
      this.calculate_progress_width()
    ));
  }
  update_label_position() {
    const t = this.bar_group.querySelector(".img_mask") || "", e = this.$bar, i = this.group.querySelector(".bar-label"), s = this.group.querySelector(".bar-img");
    let n = 5, o = this.image_size + 10;
    const a = i.getBBox().width, h = e.getWidth();
    a > h ? (i.classList.add("big"), s ? (s.setAttribute("x", e.getEndX() + n), t.setAttribute("x", e.getEndX() + n), i.setAttribute("x", e.getEndX() + o)) : i.setAttribute("x", e.getEndX() + n)) : (i.classList.remove("big"), s ? (s.setAttribute("x", e.getX() + n), t.setAttribute("x", e.getX() + n), i.setAttribute(
      "x",
      e.getX() + h / 2 + o
    )) : i.setAttribute(
      "x",
      e.getX() + h / 2 - a / 2
    ));
  }
  update_handle_position() {
    if (this.invalid || this.gantt.options.readonly) return;
    const t = this.$bar;
    this.handle_group.querySelector(".handle.left").setAttribute("x", t.getX()), this.handle_group.querySelector(".handle.right").setAttribute("x", t.getEndX());
    const e = this.group.querySelector(".handle.progress");
    e && e.setAttribute("cx", this.$bar_progress.getEndX());
  }
  update_arrow_position() {
    this.arrows = this.arrows || [];
    for (let t of this.arrows)
      t.update();
  }
}
class I {
  constructor(t, e, i) {
    this.parent = t, this.popup_func = e, this.gantt = i, this.make();
  }
  make() {
    this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="details"></div>
            <div class="actions"></div>
        `, this.hide(), this.title = this.parent.querySelector(".title"), this.subtitle = this.parent.querySelector(".subtitle"), this.details = this.parent.querySelector(".details"), this.actions = this.parent.querySelector(".actions");
  }
  show({ x: t, y: e, task: i, target: s }) {
    this.actions.innerHTML = "";
    let n = this.popup_func({
      task: i,
      chart: this.gantt,
      get_title: () => this.title,
      set_title: (o) => this.title.innerHTML = o,
      get_subtitle: () => this.subtitle,
      set_subtitle: (o) => this.subtitle.innerHTML = o,
      get_details: () => this.details,
      set_details: (o) => this.details.innerHTML = o,
      add_action: (o, a) => {
        let h = this.gantt.create_el({
          classes: "action-btn",
          type: "button",
          append_to: this.actions
        });
        typeof o == "function" && (o = o(i)), h.innerHTML = o, h.onclick = (l) => a(i, this.gantt, l);
      }
    });
    n !== !1 && (n && (this.parent.innerHTML = n), this.actions.innerHTML === "" ? this.actions.remove() : this.parent.appendChild(this.actions), this.parent.style.left = t + 10 + "px", this.parent.style.top = e - 10 + "px", this.parent.classList.remove("hide"));
  }
  hide() {
    this.parent.classList.add("hide");
  }
}
function A(r) {
  const t = r.getFullYear();
  return t - t % 10 + "";
}
function O(r, t, e) {
  let i = d.add(r, 6, "day"), s = i.getMonth() !== r.getMonth() ? "D MMM" : "D", n = !t || r.getMonth() !== t.getMonth() ? "D MMM" : "D";
  return `${d.format(r, n, e)} - ${d.format(i, s, e)}`;
}
const y = [
  /*{
      name: 'Hour',
      padding: '7d',
      step: '1h',
      date_format: 'YYYY-MM-DD HH:',
      lower_text: 'HH',
      upper_text: (d, ld, lang) =>
          !ld || d.getDate() !== ld.getDate()
              ? date_utils.format(d, 'D MMMM', lang)
              : '',
      upper_text_frequency: 24,
  },
  {
      name: 'Quarter Day',
      padding: '7d',
      step: '6h',
      date_format: 'YYYY-MM-DD HH:',
      lower_text: 'HH',
      upper_text: (d, ld, lang) =>
          !ld || d.getDate() !== ld.getDate()
              ? date_utils.format(d, 'D MMM', lang)
              : '',
      upper_text_frequency: 4,
  },
  {
      name: 'Half Day',
      padding: '14d',
      step: '12h',
      date_format: 'YYYY-MM-DD HH:',
      lower_text: 'HH',
      upper_text: (d, ld, lang) =>
          !ld || d.getDate() !== ld.getDate()
              ? d.getMonth() !== d.getMonth()
                  ? date_utils.format(d, 'D MMM', lang)
                  : date_utils.format(d, 'D', lang)
              : '',
      upper_text_frequency: 2,
  },*/
  {
    name: "Day",
    padding: "7d",
    date_format: "YYYY-MM-DD",
    step: "1d",
    lower_text: (r, t, e) => !t || r.getDate() !== t.getDate() ? d.format(r, "D", e) : "",
    upper_text: (r, t, e) => !t || r.getMonth() !== t.getMonth() ? d.format(r, "MMMM", e) : "",
    thick_line: (r) => r.getDay() === 1
  },
  {
    name: "Week",
    padding: "1m",
    step: "7d",
    date_format: "YYYY-MM-DD",
    column_width: 140,
    lower_text: O,
    upper_text: (r, t, e) => !t || r.getMonth() !== t.getMonth() ? d.format(r, "MMMM", e) : "",
    thick_line: (r) => r.getDate() >= 1 && r.getDate() <= 7,
    upper_text_frequency: 4
  },
  {
    name: "Month",
    padding: "2m",
    step: "1m",
    column_width: 120,
    date_format: "YYYY-MM",
    lower_text: "MMMM",
    upper_text: (r, t, e) => !t || r.getFullYear() !== t.getFullYear() ? d.format(r, "YYYY", e) : "",
    thick_line: (r) => r.getMonth() % 3 === 0,
    snap_at: "7d"
  },
  {
    name: "Year",
    padding: "2y",
    step: "1y",
    column_width: 120,
    date_format: "YYYY",
    upper_text: (r, t, e) => !t || A(r) !== A(t) ? A(r) : "",
    lower_text: "YYYY",
    snap_at: "30d"
  }
], z = {
  arrow_curve: 5,
  auto_move_label: !1,
  bar_corner_radius: 3,
  bar_height: 30,
  container_height: "auto",
  column_width: null,
  date_format: "YYYY-MM-DD HH:mm",
  upper_header_height: 45,
  lower_header_height: 30,
  snap_at: null,
  infinite_padding: !0,
  holidays: { "var(--g-weekend-highlight-color)": "weekend" },
  ignore: [],
  language: "en",
  lines: "both",
  move_dependencies: !0,
  padding: 18,
  popup: (r) => {
    r.set_title(r.task.name), r.task.description ? r.set_subtitle(r.task.description) : r.set_subtitle("");
    const t = d.format(
      r.task._start,
      "MMM D",
      r.chart.options.language
    ), e = d.format(
      d.add(r.task._end, -1, "second"),
      "MMM D",
      r.chart.options.language
    );
    r.set_details(
      `${t} - ${e} (${r.task.actual_duration} days${r.task.ignored_duration ? " + " + r.task.ignored_duration + " excluded" : ""})<br/>Progress: ${Math.floor(r.task.progress * 100) / 100}%`
    );
  },
  popup_on: "click",
  readonly_progress: !1,
  readonly_dates: !1,
  readonly: !1,
  scroll_to: "today",
  show_expected_progress: !1,
  today_button: !0,
  view_mode: "Day",
  view_mode_select: !1,
  view_modes: y
};
class B {
  constructor(t, e, i) {
    this.setup_wrapper(t), this.setup_options(i), this.setup_tasks(e), this.change_view_mode(), this.bind_events();
  }
  setup_wrapper(t) {
    let e, i;
    if (typeof t == "string") {
      let s = document.querySelector(t);
      if (!s)
        throw new ReferenceError(
          `CSS selector "${t}" could not be found in DOM`
        );
      t = s;
    }
    if (t instanceof HTMLElement)
      i = t, e = t.querySelector("svg");
    else if (t instanceof SVGElement)
      e = t;
    else
      throw new TypeError(
        "Frappe Gantt only supports usage of a string CSS selector, HTML DOM element or SVG DOM element for the 'element' parameter"
      );
    e ? (this.$svg = e, this.$svg.classList.add("gantt")) : this.$svg = f("svg", {
      append_to: i,
      class: "gantt"
    }), this.$container = this.create_el({
      classes: "gantt-container",
      append_to: this.$svg.parentElement
    }), this.$container.appendChild(this.$svg), this.$popup_wrapper = this.create_el({
      classes: "popup-wrapper",
      append_to: this.$container
    });
  }
  setup_options(t) {
    this.original_options = t, this.options = { ...z, ...t };
    const e = {
      "grid-height": "container_height",
      "bar-height": "bar_height",
      "lower-header-height": "lower_header_height",
      "upper-header-height": "upper_header_height"
    };
    for (let i in e) {
      let s = this.options[e[i]];
      s !== "auto" && this.$container.style.setProperty(
        "--gv-" + i,
        s + "px"
      );
    }
    if (this.options.height && this.$container.style.setProperty("height", this.options.height), this.config = {
      ignored_dates: [],
      ignored_positions: [],
      extend_by_units: 10
    }, typeof this.options.ignore != "function") {
      typeof this.options.ignore == "string" && (this.options.ignore = [this.options.ignord]);
      for (let i of this.options.ignore) {
        if (typeof i == "function") {
          this.config.ignored_function = i;
          continue;
        }
        typeof i == "string" && (i === "weekend" ? this.config.ignored_function = (s) => s.getDay() == 6 || s.getDay() == 0 : this.config.ignored_dates.push(/* @__PURE__ */ new Date(i + " ")));
      }
    } else
      this.config.ignored_function = this.options.ignore;
  }
  update_options(t) {
    this.setup_options({ ...this.original_options, ...t }), this.change_view_mode(void 0, !0);
  }
  setup_tasks(t) {
    this.tasks = t.map((e, i) => {
      if (!e.start)
        return console.error(
          `task "${e.id}" doesn't have a start date`
        ), !1;
      if (e._start = d.parse(e.start), e.end === void 0 && e.duration !== void 0 && (e.end = e._start, e.duration.split(" ").forEach((a) => {
        let { duration: h, scale: l } = d.parse_duration(a);
        e.end = d.add(e.end, h, l);
      })), !e.end)
        return console.error(`task "${e.id}" doesn't have an end date`), !1;
      if (e._end = d.parse(e.end), d.diff(e._end, e._start, "year") < 0)
        return console.error(
          `start of task can't be after end of task: in task "${e.id}"`
        ), !1;
      if (d.diff(e._end, e._start, "year") > 10)
        return console.error(
          `the duration of task "${e.id}" is too long (above ten years)`
        ), !1;
      if (e._index = i, d.get_date_values(e._end).slice(3).every((o) => o === 0) && (e._end = d.add(e._end, 24, "hour")), typeof e.dependencies == "string" || !e.dependencies) {
        let o = [];
        e.dependencies && (o = e.dependencies.split(",").map((a) => a.trim().replaceAll(" ", "_")).filter((a) => a)), e.dependencies = o;
      }
      if (e.id ? typeof e.id == "string" ? e.id = e.id.replaceAll(" ", "_") : e.id = `${e.id}` : e.id = N(e), e.baseline && this.options.show_baseline) {
        if (!e.baseline_start)
          return console.error(
            `task "${e.id}" doesn't have a baseline start date`
          ), !1;
        if (e._baseline_start = d.parse(e.baseline_start), e.baseline_end === void 0 && e.baseline_duration !== void 0 && (e.baseline_end = e._baseline_start, e.baseline_duration.split(" ").forEach((l) => {
          let { duration: _, scale: g } = d.parse_duration(l);
          e.baseline_end = d.add(e.baseline_end, _, g);
        })), !e.baseline_end)
          return console.error(`task "${e.id}" doesn't have an baseline end date`), !1;
        if (e._baseline_end = d.parse(e.baseline_end), d.diff(e._baseline_end, e._baseline_start, "year") < 0)
          return console.error(
            `Baseline start of task can't be after end of task: in task "${e.id}"`
          ), !1;
        if (d.diff(e._baseline_end, e._baseline_start, "year") > 10)
          return console.error(
            `the duration baseline of  task "${e.id}" is too long (above ten years)`
          ), !1;
        d.get_date_values(e._baseline_end).slice(3).every((h) => h === 0) && (e._baseline_end = d.add(e._baseline_end, 24, "hour"));
      }
      return e;
    }).filter((e) => e), this.setup_dependencies();
  }
  setup_dependencies() {
    this.dependency_map = {};
    for (let t of this.tasks)
      for (let e of t.dependencies)
        this.dependency_map[e] = this.dependency_map[e] || [], this.dependency_map[e].push(t.id);
  }
  refresh(t) {
    this.setup_tasks(t), this.change_view_mode();
  }
  update_task(t, e) {
    let i = this.tasks.find((n) => n.id === t), s = this.bars[i._index];
    Object.assign(i, e), s.refresh();
  }
  change_view_mode(t = this.options.view_mode, e = !1) {
    typeof t == "string" && (t = this.options.view_modes.find((n) => n.name === t));
    let i, s;
    e && (i = this.$container.scrollLeft, s = this.options.scroll_to, this.options.scroll_to = null), this.options.view_mode = t.name, this.config.view_mode = t, this.update_view_scale(t), this.setup_dates(e), this.render(), e && (this.$container.scrollLeft = i, this.options.scroll_to = s), this.trigger_event("view_change", [t]), this.options.height && this.$container.style.setProperty("height", this.options.height);
  }
  update_view_scale(t) {
    let { duration: e, scale: i } = d.parse_duration(t.step);
    this.config.step = e, this.config.unit = i, this.config.column_width = this.options.column_width || t.column_width || 45, this.$container.style.setProperty(
      "--gv-column-width",
      this.config.column_width + "px"
    ), this.config.header_height = this.options.lower_header_height + this.options.upper_header_height + 10;
  }
  setup_dates(t = !1) {
    this.setup_gantt_dates(t), this.setup_date_values();
  }
  setup_gantt_dates(t) {
    let e, i;
    this.tasks.length || (e = /* @__PURE__ */ new Date(), i = /* @__PURE__ */ new Date());
    for (let s of this.tasks)
      (!e || s._start < e) && (e = s._start), (!i || s._end > i) && (i = s._end);
    if (e = d.start_of(e, this.config.unit), i = d.start_of(i, this.config.unit), !t)
      if (this.options.infinite_padding)
        this.gantt_start = d.add(
          e,
          -this.config.extend_by_units * 3,
          this.config.unit
        ), this.gantt_end = d.add(
          i,
          this.config.extend_by_units * 3,
          this.config.unit
        );
      else {
        typeof this.config.view_mode.padding == "string" && (this.config.view_mode.padding = [
          this.config.view_mode.padding,
          this.config.view_mode.padding
        ]);
        let [s, n] = this.config.view_mode.padding.map(
          d.parse_duration
        );
        this.gantt_start = d.add(
          e,
          -s.duration,
          s.scale
        ), this.gantt_end = d.add(
          i,
          n.duration,
          n.scale
        );
      }
    this.config.date_format = this.config.view_mode.date_format || this.options.date_format, this.gantt_start.setHours(0, 0, 0, 0);
  }
  setup_date_values() {
    let t = this.gantt_start;
    for (this.dates = [t]; t < this.gantt_end; )
      t = d.add(
        t,
        this.config.step,
        this.config.unit
      ), this.dates.push(t);
  }
  bind_events() {
    this.bind_grid_click(), this.bind_holiday_labels(), this.bind_bar_events();
  }
  render() {
    this.clear(), this.setup_layers(), this.make_grid(), this.make_dates(), this.make_grid_extras(), this.make_bars(), this.make_arrows(), this.map_arrows_on_bars(), this.set_dimensions(), this.set_scroll_position(this.options.scroll_to);
  }
  setup_layers() {
    this.layers = {};
    const t = ["grid", "arrow", "progress", "bar"];
    for (let e of t)
      this.layers[e] = f("g", {
        class: e,
        append_to: this.$svg
      });
    this.$extras = this.create_el({
      classes: "extras",
      append_to: this.$container
    }), this.$adjust = this.create_el({
      classes: "adjust hide",
      append_to: this.$extras,
      type: "button"
    }), this.$adjust.innerHTML = "&larr;";
  }
  make_grid() {
    this.make_grid_background(), this.make_grid_rows(), this.make_grid_header(), this.make_side_header();
  }
  make_grid_extras() {
    this.make_grid_highlights(), this.make_grid_ticks();
  }
  make_grid_background() {
    const t = this.dates.length * this.config.column_width, e = Math.max(
      this.config.header_height + this.options.padding + (this.options.bar_height + this.options.padding) * this.tasks.length - 10,
      this.options.container_height !== "auto" ? this.options.container_height : 0
    );
    f("rect", {
      x: 0,
      y: 0,
      width: t,
      height: e,
      class: "grid-background",
      append_to: this.$svg
    }), p.attr(this.$svg, {
      height: e,
      width: "100%"
    }), this.grid_height = e, this.options.container_height === "auto" && (this.$container.style.height = e + "px");
  }
  make_grid_rows() {
    const t = f("g", { append_to: this.layers.grid }), e = this.dates.length * this.config.column_width, i = this.options.bar_height + this.options.padding;
    this.config.header_height;
    for (let s = this.config.header_height; s < this.grid_height; s += i)
      f("rect", {
        x: 0,
        y: s,
        width: e,
        height: i,
        class: "grid-row",
        append_to: t
      });
  }
  make_grid_header() {
    this.$header = this.create_el({
      width: this.dates.length * this.config.column_width,
      classes: "grid-header",
      append_to: this.$container
    }), this.$upper_header = this.create_el({
      classes: "upper-header",
      append_to: this.$header
    }), this.$lower_header = this.create_el({
      classes: "lower-header",
      append_to: this.$header
    });
  }
  make_side_header() {
    if (this.$side_header = this.create_el({ classes: "side-header" }), this.$upper_header.prepend(this.$side_header), this.options.view_mode_select) {
      const t = document.createElement("select");
      t.classList.add("viewmode-select");
      const e = document.createElement("option");
      e.selected = !0, e.disabled = !0, e.textContent = "Mode", t.appendChild(e);
      for (const i of this.options.view_modes) {
        const s = document.createElement("option");
        s.value = i.name, s.textContent = i.name, i.name === this.config.view_mode.name && (s.selected = !0), t.appendChild(s);
      }
      t.addEventListener(
        "change",
        (function() {
          this.change_view_mode(t.value, !0);
        }).bind(this)
      ), this.$side_header.appendChild(t);
    }
    if (this.options.today_button) {
      let t = document.createElement("button");
      t.classList.add("today-button"), t.textContent = "Today", t.onclick = this.scroll_current.bind(this), this.$side_header.prepend(t), this.$today_button = t;
    }
  }
  make_grid_ticks() {
    if (this.options.lines === "none") return;
    let t = 0, e = this.config.header_height, i = this.grid_height - this.config.header_height, s = f("g", {
      class: "lines_layer",
      append_to: this.layers.grid
    }), n = this.config.header_height;
    const o = this.dates.length * this.config.column_width, a = this.options.bar_height + this.options.padding;
    if (this.options.lines !== "vertical")
      for (let h = this.config.header_height; h < this.grid_height; h += a)
        f("line", {
          x1: 0,
          y1: n + a,
          x2: o,
          y2: n + a,
          class: "row-line",
          append_to: s
        }), n += a;
    if (this.options.lines !== "horizontal")
      for (let h of this.dates) {
        let l = "tick";
        this.config.view_mode.thick_line && this.config.view_mode.thick_line(h) && (l += " thick"), f("path", {
          d: `M ${t} ${e} v ${i}`,
          class: l,
          append_to: this.layers.grid
        }), this.view_is("month") ? t += d.get_days_in_month(h) * this.config.column_width / 30 : this.view_is("year") ? t += d.get_days_in_year(h) * this.config.column_width / 365 : t += this.config.column_width;
      }
  }
  highlight_holidays() {
    let t = {};
    if (this.options.holidays)
      for (let e in this.options.holidays) {
        let i = this.options.holidays[e];
        i === "weekend" && (i = (n) => n.getDay() === 0 || n.getDay() === 6);
        let s;
        if (typeof i == "object") {
          let n = i.find((o) => typeof o == "function");
          if (n && (s = n), this.options.holidays.name) {
            let o = /* @__PURE__ */ new Date(i.date + " ");
            i = (a) => o.getTime() === a.getTime(), t[o] = i.name;
          } else
            i = (o) => this.options.holidays[e].filter((a) => typeof a != "function").map((a) => {
              if (a.name) {
                let h = /* @__PURE__ */ new Date(a.date + " ");
                return t[h] = a.name, h.getTime();
              }
              return (/* @__PURE__ */ new Date(a + " ")).getTime();
            }).includes(o.getTime());
        }
        for (let n = new Date(this.gantt_start); n <= this.gantt_end; n.setDate(n.getDate() + 1))
          if (!(this.config.ignored_dates.find(
            (o) => o.getTime() == n.getTime()
          ) || this.config.ignored_function && this.config.ignored_function(n)) && (i(n) || s && s(n))) {
            const o = d.diff(
              n,
              this.gantt_start,
              this.config.unit
            ) / this.config.step * this.config.column_width, a = this.grid_height - this.config.header_height, h = d.format(n, "YYYY-MM-DD", this.options.language).replace(" ", "_");
            if (t[n]) {
              let l = this.create_el({
                classes: "holiday-label label_" + h,
                append_to: this.$extras
              });
              l.textContent = t[n];
            }
            f("rect", {
              x: Math.round(o),
              y: this.config.header_height,
              width: this.config.column_width / d.convert_scales(
                this.config.view_mode.step,
                "day"
              ),
              height: a,
              class: "holiday-highlight " + h,
              style: `fill: ${e};`,
              append_to: this.layers.grid
            });
          }
      }
  }
  /**
   * Compute the horizontal x-axis distance and associated date for the current date and view.
   *
   * @returns Object containing the x-axis distance and date of the current date, or null if the current date is out of the gantt range.
   */
  highlight_current() {
    const t = this.get_closest_date();
    if (!t) return;
    const [e, i] = t;
    i.classList.add("current-date-highlight");
    const n = d.diff(
      /* @__PURE__ */ new Date(),
      this.gantt_start,
      this.config.unit
    ) / this.config.step * this.config.column_width;
    this.$current_highlight = this.create_el({
      top: this.config.header_height,
      left: n,
      height: this.grid_height - this.config.header_height,
      classes: "current-highlight",
      append_to: this.$container
    }), this.$current_ball_highlight = this.create_el({
      top: this.config.header_height - 6,
      left: n - 2.5,
      width: 6,
      height: 6,
      classes: "current-ball-highlight",
      append_to: this.$header
    });
  }
  make_grid_highlights() {
    this.highlight_holidays(), this.config.ignored_positions = [];
    const t = (this.options.bar_height + this.options.padding) * this.tasks.length;
    this.layers.grid.innerHTML += `<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M-1,1 l2,-2
                   M0,4 l4,-4
                   M3,5 l2,-2"
                style="stroke:grey; stroke-width:0.3" />
        </pattern>`;
    for (let i = new Date(this.gantt_start); i <= this.gantt_end; i.setDate(i.getDate() + 1)) {
      if (!this.config.ignored_dates.find(
        (n) => n.getTime() == i.getTime()
      ) && (!this.config.ignored_function || !this.config.ignored_function(i)))
        continue;
      let s = d.convert_scales(
        d.diff(i, this.gantt_start) + "d",
        this.config.unit
      ) / this.config.step;
      this.config.ignored_positions.push(s * this.config.column_width), f("rect", {
        x: s * this.config.column_width,
        y: this.config.header_height,
        width: this.config.column_width,
        height: t,
        class: "ignored-bar",
        style: "fill: url(#diagonalHatch);",
        append_to: this.$svg
      });
    }
    this.highlight_current(
      this.config.view_mode
    );
  }
  create_el({ left: t, top: e, width: i, height: s, id: n, classes: o, append_to: a, type: h }) {
    let l = document.createElement(h || "div");
    for (let _ of o.split(" ")) l.classList.add(_);
    return l.style.top = e + "px", l.style.left = t + "px", n && (l.id = n), i && (l.style.width = i + "px"), s && (l.style.height = s + "px"), a && a.appendChild(l), l;
  }
  make_dates() {
    this.get_dates_to_draw().forEach((t, e) => {
      if (t.lower_text) {
        let i = this.create_el({
          left: t.x,
          top: t.lower_y,
          classes: "lower-text date_" + v(t.formatted_date),
          append_to: this.$lower_header
        });
        i.innerText = t.lower_text;
      }
      if (t.upper_text) {
        let i = this.create_el({
          left: t.x,
          top: t.upper_y,
          classes: "upper-text",
          append_to: this.$upper_header
        });
        i.innerText = t.upper_text;
      }
    }), this.upperTexts = Array.from(
      this.$container.querySelectorAll(".upper-text")
    );
  }
  get_dates_to_draw() {
    let t = null;
    return this.dates.map((i, s) => {
      const n = this.get_date_info(i, t, s);
      return t = n, n;
    });
  }
  get_date_info(t, e) {
    let i = e ? e.date : null;
    this.config.column_width;
    const s = e ? e.x + e.column_width : 0;
    let n = this.config.view_mode.upper_text, o = this.config.view_mode.lower_text;
    return n ? typeof n == "string" && (this.config.view_mode.upper_text = (a) => d.format(a, n, this.options.language)) : this.config.view_mode.upper_text = () => "", o ? typeof o == "string" && (this.config.view_mode.lower_text = (a) => d.format(a, o, this.options.language)) : this.config.view_mode.lower_text = () => "", {
      date: t,
      formatted_date: v(
        d.format(
          t,
          this.config.date_format,
          this.options.language
        )
      ),
      column_width: this.config.column_width,
      x: s,
      upper_text: this.config.view_mode.upper_text(
        t,
        i,
        this.options.language
      ),
      lower_text: this.config.view_mode.lower_text(
        t,
        i,
        this.options.language
      ),
      upper_y: 17,
      lower_y: this.options.upper_header_height + 5
    };
  }
  make_bars() {
    this.bars = this.tasks.map((t) => {
      const e = new F(this, t);
      return this.layers.bar.appendChild(e.group), e;
    });
  }
  make_arrows() {
    this.arrows = [];
    for (let t of this.tasks) {
      let e = [];
      e = t.dependencies.map((i) => {
        const s = this.get_task(i);
        if (!s) return;
        const n = new q(
          this,
          this.bars[s._index],
          // from_task
          this.bars[t._index]
          // to_task
        );
        return this.layers.arrow.appendChild(n.element), n;
      }).filter(Boolean), this.arrows = this.arrows.concat(e);
    }
  }
  map_arrows_on_bars() {
    for (let t of this.bars)
      t.arrows = this.arrows.filter((e) => e.from_task.task.id === t.task.id || e.to_task.task.id === t.task.id);
  }
  set_dimensions() {
    const { width: t } = this.$svg.getBoundingClientRect(), e = this.$svg.querySelector(".grid .grid-row") ? this.$svg.querySelector(".grid .grid-row").getAttribute("width") : 0;
    t < e && this.$svg.setAttribute("width", e);
  }
  set_scroll_position(t) {
    if (this.options.infinite_padding && (!t || t === "start")) {
      let [o, ...a] = this.get_start_end_positions();
      this.$container.scrollLeft = o;
      return;
    }
    if (!t || t === "start")
      t = this.gantt_start;
    else if (t === "end")
      t = this.gantt_end;
    else {
      if (t === "today")
        return this.scroll_current();
      typeof t == "string" && (t = d.parse(t));
    }
    const i = d.diff(
      t,
      this.gantt_start,
      this.config.unit
    ) / this.config.step * this.config.column_width;
    this.$container.scrollTo({
      left: i - this.config.column_width / 6,
      behavior: "smooth"
    }), this.$current && this.$current.classList.remove("current-upper"), this.current_date = d.add(
      this.gantt_start,
      this.$container.scrollLeft / this.config.column_width,
      this.config.unit
    );
    let s = this.config.view_mode.upper_text(
      this.current_date,
      null,
      this.options.language
    ), n = this.upperTexts.find(
      (o) => o.textContent === s
    );
    this.current_date = d.add(
      this.gantt_start,
      (this.$container.scrollLeft + n.clientWidth) / this.config.column_width,
      this.config.unit
    ), s = this.config.view_mode.upper_text(
      this.current_date,
      null,
      this.options.language
    ), n = this.upperTexts.find((o) => o.textContent === s), n.classList.add("current-upper"), this.$current = n;
  }
  scroll_current() {
    let t = this.get_closest_date();
    t && this.set_scroll_position(t[0]);
  }
  get_closest_date() {
    let t = /* @__PURE__ */ new Date();
    if (t < this.gantt_start || t > this.gantt_end) return null;
    let e = /* @__PURE__ */ new Date(), i = this.$container.querySelector(
      ".date_" + v(
        d.format(
          e,
          this.config.date_format,
          this.options.language
        )
      )
    ), s = 0;
    for (; !i && s < this.config.step; )
      e = d.add(e, -1, this.config.unit), i = this.$container.querySelector(
        ".date_" + v(
          d.format(
            e,
            this.config.date_format,
            this.options.language
          )
        )
      ), s++;
    return [
      /* @__PURE__ */ new Date(
        d.format(
          e,
          this.config.date_format,
          this.options.language
        ) + " "
      ),
      i
    ];
  }
  bind_grid_click() {
    p.on(
      this.$container,
      "click",
      ".grid-row, .grid-header, .ignored-bar, .holiday-highlight",
      () => {
        this.unselect_all(), this.hide_popup();
      }
    );
  }
  bind_holiday_labels() {
    const t = this.$container.querySelectorAll(".holiday-highlight");
    for (let e of t) {
      const i = this.$container.querySelector(
        ".label_" + e.classList[1]
      );
      if (!i) continue;
      let s;
      e.onmouseenter = (n) => {
        s = setTimeout(() => {
          i.classList.add("show"), i.style.left = (n.offsetX || n.layerX) + "px", i.style.top = (n.offsetY || n.layerY) + "px";
        }, 300);
      }, e.onmouseleave = (n) => {
        clearTimeout(s), i.classList.remove("show");
      };
    }
  }
  get_start_end_positions() {
    if (!this.bars.length) return [0, 0, 0];
    let { x: t, width: e } = this.bars[0].group.getBBox(), i = t, s = t, n = t + e;
    return Array.prototype.forEach.call(this.bars, function({ group: o }, a) {
      let { x: h, width: l } = o.getBBox();
      h < i && (i = h), h > s && (s = h), h + l > n && (n = h + l);
    }), [i, s, n];
  }
  bind_bar_events() {
    let t = !1, e = 0, i = 0, s = !1, n = !1, o = null, a = [];
    this.bar_being_dragged = null;
    const h = () => t || s || n;
    this.$svg.onclick = (_) => {
      _.target.classList.contains("grid-row") && this.unselect_all();
    };
    let l = 0;
    if (p.on(this.$svg, "mousemove", ".bar-wrapper, .handle", (_) => {
      this.bar_being_dragged === !1 && Math.abs((_.offsetX || _.layerX) - l) > 10 && (this.bar_being_dragged = !0);
    }), p.on(this.$svg, "mousedown", ".bar-wrapper, .handle", (_, g) => {
      const c = p.closest(".bar-wrapper", g);
      g.classList.contains("left") ? (s = !0, g.classList.add("visible")) : g.classList.contains("right") ? (n = !0, g.classList.add("visible")) : g.classList.contains("bar-wrapper") && (t = !0), this.popup && this.popup.hide(), e = _.offsetX || _.layerX, _.offsetY || _.layerY, o = c.getAttribute("data-id");
      let u;
      this.options.move_dependencies ? u = [
        o,
        ...this.get_all_dependent_tasks(o)
      ] : u = [o], a = u.map((w) => this.get_bar(w)), this.bar_being_dragged = !1, l = e, a.forEach((w) => {
        const m = w.$bar;
        m.ox = m.getX(), m.oy = m.getY(), m.owidth = m.getWidth(), m.finaldx = 0;
      });
    }), this.options.infinite_padding) {
      let _ = !1;
      p.on(this.$container, "mousewheel", (g) => {
        let c = this.$container.scrollWidth / 2;
        if (!_ && g.currentTarget.scrollLeft <= c) {
          let u = g.currentTarget.scrollLeft;
          _ = !0, this.gantt_start = d.add(
            this.gantt_start,
            -this.config.extend_by_units,
            this.config.unit
          ), this.setup_date_values(), this.render(), g.currentTarget.scrollLeft = u + this.config.column_width * this.config.extend_by_units, setTimeout(() => _ = !1, 300);
        }
        if (!_ && g.currentTarget.scrollWidth - (g.currentTarget.scrollLeft + g.currentTarget.clientWidth) <= c) {
          let u = g.currentTarget.scrollLeft;
          _ = !0, this.gantt_end = d.add(
            this.gantt_end,
            this.config.extend_by_units,
            this.config.unit
          ), this.setup_date_values(), this.render(), g.currentTarget.scrollLeft = u, setTimeout(() => _ = !1, 300);
        }
      });
    }
    p.on(this.$container, "scroll", (_) => {
      let g = [];
      const c = this.bars.map(
        ({ group: b }) => b.getAttribute("data-id")
      );
      let u;
      i && (u = _.currentTarget.scrollLeft - i), this.current_date = d.add(
        this.gantt_start,
        _.currentTarget.scrollLeft / this.config.column_width * this.config.step,
        this.config.unit
      );
      let w = this.config.view_mode.upper_text(
        this.current_date,
        null,
        this.options.language
      ), m = this.upperTexts.find(
        (b) => b.textContent === w
      );
      this.current_date = d.add(
        this.gantt_start,
        (_.currentTarget.scrollLeft + m.clientWidth) / this.config.column_width * this.config.step,
        this.config.unit
      ), w = this.config.view_mode.upper_text(
        this.current_date,
        null,
        this.options.language
      ), m = this.upperTexts.find(
        (b) => b.textContent === w
      ), m !== this.$current && (this.$current && this.$current.classList.remove("current-upper"), m.classList.add("current-upper"), this.$current = m), i = _.currentTarget.scrollLeft;
      let [E, X, H] = this.get_start_end_positions();
      i > H + 100 ? (this.$adjust.innerHTML = "&larr;", this.$adjust.classList.remove("hide"), this.$adjust.onclick = () => {
        this.$container.scrollTo({
          left: X,
          behavior: "smooth"
        });
      }) : i + _.currentTarget.offsetWidth < E - 100 ? (this.$adjust.innerHTML = "&rarr;", this.$adjust.classList.remove("hide"), this.$adjust.onclick = () => {
        this.$container.scrollTo({
          left: E,
          behavior: "smooth"
        });
      }) : this.$adjust.classList.add("hide"), u && (g = c.map((b) => this.get_bar(b)), this.options.auto_move_label && g.forEach((b) => {
        b.update_label_position_on_horizontal_scroll({
          x: u,
          sx: _.currentTarget.scrollLeft
        });
      }));
    }), p.on(this.$svg, "mousemove", (_) => {
      if (!h()) return;
      const g = (_.offsetX || _.layerX) - e;
      a.forEach((c) => {
        const u = c.$bar;
        u.finaldx = this.get_snap_position(g, u.ox), this.hide_popup(), s ? o === c.task.id ? c.update_bar_position({
          x: u.ox + u.finaldx,
          width: u.owidth - u.finaldx
        }) : c.update_bar_position({
          x: u.ox + u.finaldx
        }) : n ? o === c.task.id && c.update_bar_position({
          width: u.owidth + u.finaldx
        }) : t && !this.options.readonly && !this.options.readonly_dates && c.update_bar_position({ x: u.ox + u.finaldx });
      });
    }), document.addEventListener("mouseup", () => {
      var _, g, c;
      t = !1, s = !1, n = !1, (c = (g = (_ = this.$container.querySelector(".visible")) == null ? void 0 : _.classList) == null ? void 0 : g.remove) == null || c.call(g, "visible");
    }), p.on(this.$svg, "mouseup", (_) => {
      this.bar_being_dragged = null, a.forEach((g) => {
        g.$bar.finaldx && (g.date_changed(), g.compute_progress(), g.set_action_completed());
      });
    }), this.bind_bar_progress();
  }
  bind_bar_progress() {
    let t = 0, e = null, i = null, s = null, n = null;
    p.on(this.$svg, "mousedown", ".handle.progress", (a, h) => {
      e = !0, t = a.offsetX || a.layerX, y_on_start = a.offsetY || a.layerY;
      const _ = p.closest(".bar-wrapper", h).getAttribute("data-id");
      i = this.get_bar(_), s = i.$bar_progress, n = i.$bar, s.finaldx = 0, s.owidth = s.getWidth(), s.min_dx = -s.owidth, s.max_dx = n.getWidth() - s.getWidth();
    });
    const o = this.config.ignored_positions.map((a) => [
      a,
      a + this.config.column_width
    ]);
    p.on(this.$svg, "mousemove", (a) => {
      if (!e) return;
      let h = a.offsetX || a.layerX;
      if (h > t) {
        let g = o.find(
          ([c, u]) => h >= c && h < u
        );
        for (; g; )
          h = g[1], g = o.find(
            ([c, u]) => h >= c && h < u
          );
      } else {
        let g = o.find(
          ([c, u]) => h > c && h <= u
        );
        for (; g; )
          h = g[0], g = o.find(
            ([c, u]) => h > c && h <= u
          );
      }
      let _ = h - t;
      _ > s.max_dx && (_ = s.max_dx), _ < s.min_dx && (_ = s.min_dx), s.setAttribute("width", s.owidth + _), p.attr(i.$handle_progress, "cx", s.getEndX()), s.finaldx = _;
    }), p.on(this.$svg, "mouseup", () => {
      e = !1, s && s.finaldx && (s.finaldx = 0, i.progress_changed(), i.set_action_completed(), i = null, s = null, n = null);
    });
  }
  get_all_dependent_tasks(t) {
    let e = [], i = [t];
    for (; i.length; ) {
      const s = i.reduce((n, o) => (n = n.concat(this.dependency_map[o]), n), []);
      e = e.concat(s), i = s.filter((n) => !i.includes(n));
    }
    return e.filter(Boolean);
  }
  get_snap_position(t, e) {
    let i = 1;
    const s = this.options.snap_at || this.config.view_mode.snap_at || "1d";
    if (s !== "unit") {
      const { duration: _, scale: g } = d.parse_duration(s);
      i = d.convert_scales(this.config.view_mode.step, g) / _;
    }
    const n = t % (this.config.column_width / i);
    let o = t - n + (n < this.config.column_width / i * 2 ? 0 : this.config.column_width / i), a = e + o;
    const h = o > 0 ? 1 : -1;
    let l = this.get_ignored_region(a, h);
    for (; l.length; )
      a += this.config.column_width * h, l = this.get_ignored_region(a, h), l.length || (a -= this.config.column_width * h);
    return a - e;
  }
  get_ignored_region(t, e = 1) {
    return e === 1 ? this.config.ignored_positions.filter((i) => t > i && t <= i + this.config.column_width) : this.config.ignored_positions.filter(
      (i) => t >= i && t < i + this.config.column_width
    );
  }
  unselect_all() {
    this.popup && this.popup.parent.classList.add("hide"), this.$container.querySelectorAll(".date-range-highlight").forEach((t) => t.classList.add("hide"));
  }
  view_is(t) {
    return typeof t == "string" ? this.config.view_mode.name === t : Array.isArray(t) ? t.some(view_is) : this.config.view_mode.name === t.name;
  }
  get_task(t) {
    return this.tasks.find((e) => e.id === t);
  }
  get_bar(t) {
    return this.bars.find((e) => e.task.id === t);
  }
  show_popup(t) {
    this.options.popup !== !1 && (this.popup || (this.popup = new I(
      this.$popup_wrapper,
      this.options.popup,
      this
    )), this.popup.show(t));
  }
  hide_popup() {
    this.popup && this.popup.hide();
  }
  trigger_event(t, e) {
    this.options["on_" + t] && this.options["on_" + t].apply(this, e);
  }
  /**
   * Gets the oldest starting date from the list of tasks
   *
   * @returns Date
   * @memberof Gantt
   */
  get_oldest_starting_date() {
    return this.tasks.length ? this.tasks.map((t) => t._start).reduce(
      (t, e) => e <= t ? e : t
    ) : /* @__PURE__ */ new Date();
  }
  /**
   * Clear all elements from the parent svg element
   *
   * @memberof Gantt
   */
  clear() {
    var t, e, i, s, n, o, a, h, l, _;
    this.$svg.innerHTML = "", (e = (t = this.$header) == null ? void 0 : t.remove) == null || e.call(t), (s = (i = this.$side_header) == null ? void 0 : i.remove) == null || s.call(i), (o = (n = this.$current_highlight) == null ? void 0 : n.remove) == null || o.call(n), (h = (a = this.$extras) == null ? void 0 : a.remove) == null || h.call(a), (_ = (l = this.popup) == null ? void 0 : l.hide) == null || _.call(l);
  }
}
B.VIEW_MODE = {
  //HOUR: DEFAULT_VIEW_MODES[0],
  //QUARTER_DAY: DEFAULT_VIEW_MODES[1],
  //HALF_DAY: DEFAULT_VIEW_MODES[2],
  DAY: y[3],
  WEEK: y[4],
  MONTH: y[5],
  YEAR: y[6]
};
function N(r) {
  return r.name + "_" + Math.random().toString(36).slice(2, 12);
}
function v(r) {
  return r.replaceAll(" ", "_").replaceAll(":", "_").replaceAll(".", "_");
}
export {
  B as default
};
//# sourceMappingURL=frappe-gantt.js.map
