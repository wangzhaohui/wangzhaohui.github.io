
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/components/CDialog.svelte generated by Svelte v3.18.1 */
    const file = "src/components/CDialog.svelte";

    function create_fragment(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "close-btn");
    			add_location(div0, file, 31, 4, 607);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file, 32, 4, 641);
    			attr_dev(div2, "class", "dialog svelte-1b27682");
    			add_location(div2, file, 30, 2, 561);
    			attr_dev(div3, "class", "mask hidden svelte-1b27682");
    			add_location(div3, file, 29, 0, 514);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			/*div2_binding*/ ctx[6](div2);
    			/*div3_binding*/ ctx[7](div3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 16) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[4], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (default_slot) default_slot.d(detaching);
    			/*div2_binding*/ ctx[6](null);
    			/*div3_binding*/ ctx[7](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { visible = false } = $$props;
    	let mask, dialog;

    	let closeDialog = () => {
    		$$invalidate(2, visible = false);
    	};

    	onMount(() => {
    		mask.addEventListener("click", evt => {
    			if (evt.target.classList.contains("mask")) {
    				closeDialog();
    			}
    		});
    	}); // mask.addEventListener('')

    	const writable_props = ["visible"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CDialog> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, dialog = $$value);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, mask = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("visible" in $$props) $$invalidate(2, visible = $$props.visible);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { visible, mask, dialog, closeDialog };
    	};

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(2, visible = $$props.visible);
    		if ("mask" in $$props) $$invalidate(0, mask = $$props.mask);
    		if ("dialog" in $$props) $$invalidate(1, dialog = $$props.dialog);
    		if ("closeDialog" in $$props) closeDialog = $$props.closeDialog;
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mask, visible*/ 5) {
    			 {
    				if (mask) {
    					if (visible) {
    						mask.classList.remove("hidden");
    					} else {
    						mask.classList.add("hidden");
    					}
    				}
    			}
    		}
    	};

    	return [
    		mask,
    		dialog,
    		visible,
    		closeDialog,
    		$$scope,
    		$$slots,
    		div2_binding,
    		div3_binding
    	];
    }

    class CDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { visible: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CDialog",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get visible() {
    		throw new Error("<CDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<CDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.18.1 */
    const file$1 = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i].id;
    	child_ctx[11] = list[i].label;
    	child_ctx[12] = list[i].url;
    	child_ctx[13] = list[i].action;
    	return child_ctx;
    }

    // (88:5) {:else}
    function create_else_block(ctx) {
    	let a;
    	let t_value = /*label*/ ctx[11] + "";
    	let t;
    	let a_class_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", "javascript:void(0)");
    			attr_dev(a, "class", a_class_value = "" + (null_to_empty(/*id*/ ctx[10]) + " svelte-2jbpno"));
    			add_location(a, file$1, 88, 6, 2023);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    			dispose = listen_dev(a, "click", /*action*/ ctx[13], false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(88:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (86:5) {#if url}
    function create_if_block(ctx) {
    	let a;
    	let t_value = /*label*/ ctx[11] + "";
    	let t;
    	let a_href_value;
    	let a_class_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*url*/ ctx[12]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", a_class_value = "" + (null_to_empty(/*id*/ ctx[10]) + " svelte-2jbpno"));
    			add_location(a, file$1, 86, 6, 1949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(86:5) {#if url}",
    		ctx
    	});

    	return block;
    }

    // (84:4) {#each socials as { id, label, url, action }}
    function create_each_block(ctx) {
    	let li;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*url*/ ctx[12]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t = space();
    			attr_dev(li, "class", "socials-list__item svelte-2jbpno");
    			add_location(li, file$1, 84, 4, 1896);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_block.m(li, null);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(84:4) {#each socials as { id, label, url, action }}",
    		ctx
    	});

    	return block;
    }

    // (96:1) <CDialog bind:visible="{wcqcVisible}">
    function create_default_slot(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "./public/wechatqrcode.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "WeChat QR Code");
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "height", "100%");
    			attr_dev(img, "class", "svelte-2jbpno");
    			add_location(img, file$1, 96, 2, 2194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(96:1) <CDialog bind:visible=\\\"{wcqcVisible}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let audio;
    	let audio_src_value;
    	let t0;
    	let div3;
    	let div1;
    	let div0;
    	let t1;
    	let div2;
    	let ul;
    	let t2;
    	let updating_visible;
    	let current;
    	let each_value = /*socials*/ ctx[3];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	function cdialog_visible_binding(value) {
    		/*cdialog_visible_binding*/ ctx[9].call(null, value);
    	}

    	let cdialog_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*wcqcVisible*/ ctx[0] !== void 0) {
    		cdialog_props.visible = /*wcqcVisible*/ ctx[0];
    	}

    	const cdialog = new CDialog({ props: cdialog_props, $$inline: true });
    	binding_callbacks.push(() => bind(cdialog, "visible", cdialog_visible_binding));

    	const block = {
    		c: function create() {
    			main = element("main");
    			audio = element("audio");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div2 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(cdialog.$$.fragment);
    			audio.loop = "true";
    			attr_dev(audio, "preload", "auto");
    			if (audio.src !== (audio_src_value = "./public/GeiNiDeAi.mp3")) attr_dev(audio, "src", audio_src_value);
    			attr_dev(audio, "class", "svelte-2jbpno");
    			add_location(audio, file$1, 75, 1, 1578);
    			attr_dev(div0, "class", "photo svelte-2jbpno");
    			add_location(div0, file$1, 78, 3, 1746);
    			attr_dev(div1, "class", "profile svelte-2jbpno");
    			add_location(div1, file$1, 77, 2, 1696);
    			attr_dev(ul, "class", "socials-list svelte-2jbpno");
    			add_location(ul, file$1, 82, 3, 1816);
    			attr_dev(div2, "class", "socials-box svelte-2jbpno");
    			add_location(div2, file$1, 81, 2, 1787);
    			attr_dev(div3, "class", "show svelte-2jbpno");
    			add_location(div3, file$1, 76, 1, 1675);
    			attr_dev(main, "class", "svelte-2jbpno");
    			add_location(main, file$1, 74, 0, 1570);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, audio);
    			/*audio_binding*/ ctx[7](audio);
    			append_dev(main, t0);
    			append_dev(main, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			/*div1_binding*/ ctx[8](div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(main, t2);
    			mount_component(cdialog, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*socials*/ 8) {
    				each_value = /*socials*/ ctx[3];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const cdialog_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				cdialog_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_visible && dirty & /*wcqcVisible*/ 1) {
    				updating_visible = true;
    				cdialog_changes.visible = /*wcqcVisible*/ ctx[0];
    				add_flush_callback(() => updating_visible = false);
    			}

    			cdialog.$set(cdialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cdialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cdialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*audio_binding*/ ctx[7](null);
    			/*div1_binding*/ ctx[8](null);
    			destroy_each(each_blocks, detaching);
    			destroy_component(cdialog);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let wcqcVisible = false;

    	let pad = function (num) {
    		return num < 10 ? `0${num}` : num;
    	};

    	const socials = [
    		{
    			id: "wechat",
    			label: "Wechat",
    			action: () => {
    				$$invalidate(0, wcqcVisible = true);
    			}
    		},
    		{
    			id: "weibo",
    			label: "Weibo",
    			url: "https://weibo.com/1768830500/profile?topnav=1&wvr=6&is_all=1"
    		},
    		{
    			id: "neteasemusic",
    			label: "Netease Music",
    			url: "https://music.163.com/#/user/home?id=261618415"
    		},
    		{
    			id: "codepen",
    			label: "Code Pen",
    			url: "https://codepen.io/glorywong"
    		},
    		{
    			id: "facebook",
    			label: "Facebook",
    			url: "https://www.facebook.com/glorywongzhaohui"
    		},
    		{
    			id: "twitter",
    			label: "Twitter",
    			url: "https://twitter.com/glorywong1001"
    		},
    		{
    			id: "instagram",
    			label: "Instagram",
    			url: "https://www.instagram.com/glorywong1001/"
    		},
    		{
    			id: "github",
    			label: "Github",
    			url: "https://github.com/glorywong"
    		},
    		{
    			id: "email",
    			label: "Email",
    			url: "mailto:glorywong1001@gmail.com"
    		}
    	];

    	const projects = [
    		{
    			label: "孝感新冠疫情",
    			url: "/2019ncov-xiaogan/",
    			image: "https://i.ibb.co/F4xxhSL/xiaogan-logo-64-64.png"
    		}
    	];

    	let playerEle, profileEle;

    	onMount(() => {
    		function exePlay() {
    			playerEle.play();
    		}

    		function exePause() {
    			playerEle.pause();
    		}

    		profileEle.addEventListener("mouseover", exePlay);
    		profileEle.addEventListener("mouseleave", exePause);
    		profileEle.addEventListener("touchstart", exePlay);
    		profileEle.addEventListener("touchend", exePause);
    	});

    	let fuck = "shit";

    	function audio_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, playerEle = $$value);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, profileEle = $$value);
    		});
    	}

    	function cdialog_visible_binding(value) {
    		wcqcVisible = value;
    		$$invalidate(0, wcqcVisible);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("wcqcVisible" in $$props) $$invalidate(0, wcqcVisible = $$props.wcqcVisible);
    		if ("pad" in $$props) pad = $$props.pad;
    		if ("playerEle" in $$props) $$invalidate(1, playerEle = $$props.playerEle);
    		if ("profileEle" in $$props) $$invalidate(2, profileEle = $$props.profileEle);
    		if ("fuck" in $$props) fuck = $$props.fuck;
    	};

    	return [
    		wcqcVisible,
    		playerEle,
    		profileEle,
    		socials,
    		pad,
    		projects,
    		fuck,
    		audio_binding,
    		div1_binding,
    		cdialog_visible_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
