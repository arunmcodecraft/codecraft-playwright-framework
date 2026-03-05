function step(level, text) {
    const map = {
        success: { bg: "#C6F6D5", color: "#22543D", icon: "SUCCESS" },
        failure: { bg: "#FEB2B2", color: "#742A2A", icon: "FAIL" },
        info: { bg: "#BEE3F8", color: "#2A4365", icon: "INFO" },
        warning: { bg: "#FEEBC8", color: "#7B341E", icon: "WARN" }
    }[level];

    const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<span style="display:inline-block;margin:4px 4px 0 0;padding:4px 8px;border-radius:12px;background:${map.bg};color:${map.color};font-size:12px;border:1px solid rgba(0,0,0,0.06);">${map.icon} ${safe}</span>`;
}

class HTMLSubStepLogger {
    constructor(attach) {
        this.attach = attach;
    }

    async success(text) {
        await this.attach(step("success", text), "text/html");
    }

    async failure(text) {
        await this.attach(step("failure", text), "text/html");
    }

    async info(text) {
        await this.attach(step("info", text), "text/html");
    }

    async warning(text) {
        await this.attach(step("warning", text), "text/html");
    }
}

module.exports = { HTMLSubStepLogger };
