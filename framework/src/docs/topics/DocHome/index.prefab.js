;(()=> {
                
import! 'docs.topics.Topic';

namespace `docs.topics` (
    class DocHome extends docs.topics.Topic {
        
    }
);



                docs.topics.DocHome.prototype.template = function(){
                    return `<template>
  <div>

    <div style="display: flex;flex-direction: row;flex-wrap: nowrap;">
      <div style="width: 50%;padding: 22px;">
        <h1 id="api-reference">Welcome</h1>
        <p>
          <em>Oros is in incubation as a private repository on github. <b>You'll need to be added as a collaborator</b> in order to fork/install. Reach out to jaysmith024@gmail.com for access.</em>
        </p>
        <p>
          Oros is an SDK for building customized framework architectures and apps. You'll want to
          start with <a href="#docs.topics.InstallFramework">installation</a> and then <a href="#docs.topics.HelloWorld">getting started.</a>
        </p>
      </div>
      <div style="width: 50%;display: block;">
        <div class="shell lang"></div>
        <div class="javascript lang"></div>
        <div class="html lang"></div>
        <div class="css lang"></div>
      </div>
    </div>

  </div>
</template>
`
                };

                docs.topics.DocHome.prototype.cssStyle = function(){
                    return `
`
                };

                docs.topics.DocHome.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();