import 'docs.components.NamespaceExplorer';

namespace `docs.topics` (
	class UnderstandingNamespaces extends docs.topics.Topic {
		async onConnected(){
            await super.onConnected();
            // await this.render();
            this.nsExplorer = this.querySelector("namespace-explorer");
            this.nsExplorer.addEventListener("input", e=> this.onChanged(e),false);
            this.nsCodeBlock = this.querySelector("#ns-code-block");
            this.msg_ns = this.querySelector("#msg-ns");
            this.where_to_save = this.querySelector("#where_to_save");

            this.why_fqns_1 = this.querySelector("#why_fqns_1");
            this.where_to_save_1 = this.querySelector("#where_to_save_1");
            this.classname_1 = this.querySelector("#classname_1");

            await wait(300);
            this.onChanged()
        }

        onChanged(e){
            var s = this.nsExplorer.textContent.trim();
            this.cls = s.substr(s.lastIndexOf(".")+1);
            this.ns = s.substr(0,s.lastIndexOf("."));
            //application.dispatchEvent("nschanged", {value:val});
            var newCode = this.nsCode();
            this.nsCodeBlock.innerHTML =newCode;
            hljs.highlightBlock(this.nsCodeBlock);
            this.msg_ns.textContent=s;
            this.where_to_save.innerHTML = "src/" + s.replace(/\./g,"/") + ".js";
            this.where_to_save_1.innerHTML = "src/" + s.replace(/\./g,"/") + ".js";
            this.why_fqns_1.innerHTML = s;
            this.classname_1.innerHTML = this.cls;


        }

        nsCode(){
            var code = `
namespace \`${this.ns}\` (
    class ${this.cls} {
        
    }
);
            `;
            return code;
        }
	}
)