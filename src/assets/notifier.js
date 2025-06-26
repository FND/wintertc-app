/// <reference lib="dom" />

class Notifier extends HTMLElement {
	static tag = "noti-fier";

	connectedCallback() {
		this.setAttribute("role", "status");
		let stream = this._stream = new EventSource(this.url, {
			withCredentials: true,
		});
		stream.addEventListener("message", this);
		stream.addEventListener("error", this);
	}

	disconnectedCallback() {
		this._stream?.close();
	}

	/** @param {MessageEvent} ev */
	handleEvent(ev) {
		switch (ev.type) {
			case "message":
				this.textContent = ev.data;
				break;
			case "error":
				this.replaceChildren();
				break;
		}
	}

	get url() {
		let res = this.getAttribute("url");
		if (!res) {
			throw new Error(`missing URL attribute on \`<${this.localName}>\``);
		}
		return res;
	}
}

customElements.define(Notifier.tag, Notifier);
