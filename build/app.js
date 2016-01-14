angular.module("app",["ui.bootstrap"]),angular.module("app").constant("appConfig",{TIMESTAMP:"timestamp",EXCLUDE_FIELDS:[],HEADER_SKIPPED_ROWS:1,ZOOM:"HighlightSelector",NONE_VALUE_REPLACEMENT:0,WINDOW_SIZE:1e4,MAX_FILE_SIZE:62914560,LOCAL_CHUNK_SIZE:65536,REMOTE_CHUNK_SIZE:65536,HIGHLIGHT_RADIUS:10}),angular.module("app").controller("appCtrl",["$scope","$http","$timeout","appConfig",function(e,i,n,t){function a(i,n,a){function r(e,t,l){var o=a.toDomXCoord(e),r=a.toDomXCoord(t),d=r-o;i.fillStyle=l,i.fillRect(o,n.y,d,n.h)}function d(e,i,n){var t=[],a=o.indexOf(i);if(-1===a)return S("Highlighting cannot work, field "+i+" not found!","danger",!0),[];for(var l=0;l<e.length;l++){var r=e[l][a];if(r>=n){var d=e[l][s];t.push(d)}}return t}for(var s=o.indexOf(t.TIMESTAMP),g=0;g<e.view.fieldState.length;g++){var h,u,f,p;if(p=e.view.fieldState[g],p.highlighted===!0&&null!==p.highlightThreshold){h=d(l,p.name,p.highlightThreshold),u=.01*l.length;var w=.4;f=p.color.replace("rgb","rgba").replace(")",","+w+")");for(var c=-1,v=0;v<h.length;v++)h[v]>=c&&(r(h[v]-u,h[v]+u,f),c=h[v]+u)}}}e.view={fieldState:[],graph:null,dataField:null,optionsVisible:!0,filePath:"",loadedFileName:"",errors:[],loading:!1,windowing:{threshold:t.MAX_FILE_SIZE,size:-1,show:!1,paused:!1,aborted:!1,update_interval:1}};var l=[],o=[],r=[],d={},s=!1,g=0,h=-1,u=null,f=!1;e.toggleOptions=function(){e.view.optionsVisible=!e.view.optionsVisible,e.view.graph&&(d.resize=n(function(){e.view.graph.resize()}))},e.getRemoteFile=function(){e.view.windowing.show=!1,e.view.windowing.paused=!1,e.view.windowing.aborted=!1,e.$broadcast("fileUploadChange"),e.view.loading=!0,i.head(e.view.filePath,{headers:{Range:"bytes=0-32"}}).then(function(n){206===n.status?i.head(e.view.filePath).then(function(i){var n=i.headers("Content-Length");n>e.view.windowing.threshold&&-1!==e.view.windowing.threshold&&(e.view.windowing.show=!0,e.view.windowing.size=t.WINDOW_SIZE,S("File too large, automatic sliding window enabled.","warning")),m(e.view.filePath)}):v(e.view.filePath)},function(){v(e.view.filePath)})},e.canDownload=function(){var i=e.view.filePath.split("://");return("https"===i[0]||"http"===i[0])&&i.length>1&&i[1].length>0?!0:!1},e.abortParse=function(){angular.isDefined(u)&&angular.isDefined(u.abort)&&(u.abort(),e.view.windowing.paused=!1,e.view.windowing.aborted=!0)},e.pauseParse=function(){angular.isDefined(u)&&angular.isDefined(u.pause)&&(u.pause(),e.view.windowing.paused=!0)},e.resumeParse=function(){angular.isDefined(u)&&angular.isDefined(u.resume)&&(u.resume(),e.view.windowing.paused=!1)},e.getLocalFile=function(i){e.view.filePath=i.target.files[0].name,i.target.files[0].size>e.view.windowing.threshold&&-1!==e.view.windowing.threshold&&(e.view.windowing.show=!0,e.view.windowing.size=t.WINDOW_SIZE,S("File too large, automatic sliding window enabled.","warning")),e.view.loading=!0,E(i.target.files[0])};var p=function(e){var i=e.split("/");return i[i.length-1]},w=function(i){for(var n=-1,a=0;a<i.length;a++){for(var d=[],u=0;u<o.length;u++){var p=o[u],w=i[a][p];if(p===t.TIMESTAMP){if(g++,s?w=g:"number"==typeof w||("string"==typeof w&&null!==b(w)?w=b(w):(S("Parsing timestamp failed, fallback to using iteration number","warning",!0),w=g)),n>=w&&1!==i[a][h]){S("Your time is not monotonic at row "+g+"! Graphs are incorrect.","danger",!1),console.log("Incorrect timestamp!");break}n=w}else"None"===w&&(w=t.NONE_VALUE_REPLACEMENT);d.push(w)}d.length===o.length?(l.push(d),r.push(angular.extend([],d)),-1!==e.view.windowing.size&&l.length>e.view.windowing.size&&(l.shift(),r.shift())):console.log("Incomplete row loaded "+d+"; skipping.")}null===e.view.graph?P():g%e.view.windowing.update_interval===0&&e.view.graph.updateOptions({file:l}),f||(e.$apply(),f=!0)},c=function(){e.view.fieldState.length=0,e.view.graph=null,e.view.dataField=null,e.view.errors.length=0,e.view.loadedFileName="",s=!1,g=0,l.length=0,o.length=0,f=!1},v=function(i){c(),Papa.parse(i,{download:!0,skipEmptyLines:!0,header:!0,dynamicTyping:!0,worker:!1,comments:"#",complete:function(n){angular.isDefined(n.data)?(e.view.loadedFileName=p(i),o=I(n.data,t.EXCLUDE_FIELDS),n.data.splice(0,t.HEADER_SKIPPED_ROWS),w(n.data)):S("An error occurred when attempting to download file.","danger"),e.view.loading=!1,e.$apply()},error:function(i){e.view.loading=!1,S("Could not download file.","danger")}})},m=function(i){c(),Papa.RemoteChunkSize=t.REMOTE_CHUNK_SIZE;Papa.parse(i,{download:!0,skipEmptyLines:!0,header:!0,dynamicTyping:!0,worker:!1,comments:"#",chunk:function(e,i){u=i,w(e.data)},beforeFirstChunk:function(n){e.view.loadedFileName=p(i);var a=n.split(/\r\n|\r|\n/);return o=I(a,t.EXCLUDE_FIELDS),a.splice(1,t.HEADER_SKIPPED_ROWS),e.view.loading=!1,a=a.join("\n")},error:function(i){S("Could not stream file.","danger"),e.view.loading=!1}})},E=function(i){c(),Papa.LocalChunkSize=t.LOCAL_CHUNK_SIZE;Papa.parse(i,{skipEmptyLines:!0,header:!0,dynamicTyping:!0,worker:!1,comments:"#",chunk:function(e,i){u=i,w(e.data)},beforeFirstChunk:function(n){e.view.loadedFileName=i.name;var a=n.split(/\r\n|\r|\n/);return o=I(a,t.EXCLUDE_FIELDS),a.splice(1,t.HEADER_SKIPPED_ROWS),e.view.loading=!1,a=a.join("\n")},error:function(i){S(i,"danger"),e.view.loading=!1}})},S=function(i,n,t){if(t="undefined"!=typeof t?t:!1,exists=!1,t){errs=e.view.errors;for(var a=0;a<errs.length;a++)if(errs[a].message===i)return}e.view.errors.push({message:i,type:n}),e.$apply()};e.clearErrors=function(){e.view.errors.length=0},e.clearError=function(i){e.view.errors.splice(i,1)};var b=function(e){var i=new Date(e);if("Invalid Date"!==i.toString())return i;var n=String(e).split(" "),t=[],a=n[0].split("/"),l=n[0].split("-");if(1===a.length&&1===l.length||a.length>1&&l.length>1)return S("Could not parse the timestamp: "+e,"warning",!0),null;if(l.length>2)t.push(l[0]),t.push(l[1]),t.push(l[2]);else{if(!(a.length>2))return S("There was something wrong with the date in the timestamp field.","warning",!0),null;t.push(a[2]),t.push(a[0]),t.push(a[1])}if(n[1]){var o=n[1].split(":");t=t.concat(o)}for(var r=0;r<t.length;r++)t[r]=parseInt(t[r]);return i=new Function.prototype.bind.apply(Date,[null].concat(t)),"Invalid Date"===i.toString()?(S("The timestamp appears to be invalid.","warning",!0),null):i};e.normalizeField=function(i){var n=i+1;if(null===e.view.dataField)return void console.warn("No data field is set");for(var t=parseInt(e.view.dataField)+1,a=function(e,i){return Math[i].apply(null,e)},o=[],r=[],d=0;d<l.length;d++)"number"==typeof l[d][t]&&"number"==typeof l[d][n]&&(o.push(l[d][t]),r.push(l[d][n]));for(var s=a(o,"max")-a(o,"min"),g=a(r,"max")-a(r,"min"),h=s/g,u=0;u<l.length;u++)l[u][n]=parseFloat((l[u][n]*h).toFixed(10));e.view.graph.updateOptions({file:l})},e.denormalizeField=function(i){for(var n=i+1,t=0;t<l.length;t++)l[t][n]=r[t][n];e.view.graph.updateOptions({file:l})},e.renormalize=function(){for(var i=0;i<e.view.fieldState.length;i++)e.view.fieldState[i].normalized&&e.normalizeField(e.view.fieldState[i].id)};var y=function(i,n){for(var t=0;t<e.view.fieldState.length;t++)if(e.view.fieldState[t].name===i){e.view.fieldState[t].value=n;break}},F=function(i){for(var n=0;n<i.length;n++)e.view.fieldState[n].color=i[n]},I=function(e,i){for(var n=e[0].split(","),a=Papa.parse(e[2],{dynamicTyping:!0,skipEmptyLines:!0,comments:"#"}).data[0],l=!0,o=0;o<a.length;o++)"number"==typeof a[o]?l=!1:("R"===a[o]||"r"===a[o])&&(h=o);l&&(console.log("Detected OPF/NuPIC file. "),t.HEADER_SKIPPED_ROWS=3),-1===n.indexOf(t.TIMESTAMP)?(S("No timestamp field was found, using iterations instead","info"),s=!0):l&&-1!==h&&(S("OPF file with resets not supported. Ignoring timestamp and using iterations instead.","info"),s=!0);var r=e[e.length-2];r=Papa.parse(r,{dynamicTyping:!0,skipEmptyLines:!0,comments:"#"});for(var d=[],g=0;g<n.length;g++){var u=r.data[0][g],f=n[g];"number"==typeof u&&-1===i.indexOf(f)&&d.push(f)}return-1===d.indexOf(t.TIMESTAMP)&&d.unshift(t.TIMESTAMP),d};e.toggleVisibility=function(i){e.view.graph.setVisibility(i.id,i.visible),i.visible||(i.value=null)},e.showHideAll=function(i){for(var n=0;n<e.view.fieldState.length;n++)e.view.fieldState[n].visible=i,e.view.graph.setVisibility(e.view.fieldState[n].id,i),i||(e.view.fieldState[n].value=null)},e.updateHighlight=function(i){null!==i.highlightThreshold&&(""===i.highlightThreshold&&(i.highlightThreshold=null),e.view.graph.updateOptions({}))};var P=function(){var i=document.getElementById("dataContainer");e.view.fieldState.length=0,e.view.dataField=null;for(var n=0,r=s,d=0;d<o.length;d++){var g=o[d];g===t.TIMESTAMP||r?r=!1:(e.view.fieldState.push({name:g,id:n,visible:!0,normalized:!1,value:null,color:"rgb(0,0,0)",highlighted:!1,highlightThreshold:null}),n++)}e.view.graph=new Dygraph(i,l,{labels:o,labelsUTC:!1,showLabelsOnHighlight:!0,xlabel:"Time",ylabel:"Values",strokeWidth:1,pointClickCallback:function(e,i){timestamp=moment(i.xval),timestampString=timestamp.format("YYYY-MM-DD HH:mm:ss.SSS000"),window.prompt("Copy to clipboard: Ctrl+C, Enter",timestampString)},animatedZooms:!0,showRangeSelector:"RangeSelector"===t.ZOOM,highlightCallback:function(i,n,t,a,l){for(var o=0;o<t.length;o++)y(t[o].name,t[o].yval);e.$apply()},drawCallback:function(e,i){i&&F(e.getColors())},underlayCallback:a})};e.$on("$destroy",function(){angular.forEach(d,function(e){n.cancel(e)})})}]),angular.module("app").directive("fieldOptions",function(){return{restrict:"A",scope:!1,template:'<td style="color:{{field.color}};"><div class="span-wrapper" uib-popover="{{field.name}}" popover-trigger="mouseenter" popover-animation="false"><span>{{field.name}}</span></div></td><td><input type="checkbox" ng-model="field.visible" ng-click="toggleVisibility(field)"></td><td><input type="checkbox" ng-model="field.highlighted" ng-click="updateHighlight(field)"></td><td><input type="text" class="form-control input-sm" ng-model="field.highlightThreshold" highlight-field="field" highlight-fn="updateHighlight"></td><td><input type="checkbox" ng-disabled="field.id === view.dataField || view.dataField === null" ng-model="field.normalized"></td><td><input type="radio" ng-disabled="field.normalized" ng-model="view.dataField" ng-value="{{field.id}}"></td>',link:function(e,i,n){var t={};t.normalized=e.$watch("field.normalized",function(i,n){i?e.normalizeField(e.field.id):i||i===n||e.denormalizeField(e.field.id)}),t.isData=e.$watch("view.dataField",function(){e.renormalize()}),e.$on("$destroy",function(){angular.forEach(t,function(e){e()})})}}}),angular.module("app").directive("fileUploadChange",function(){return{restrict:"A",link:function(e,i,n){var t=e.$eval(n.fileUploadChange);i.on("change",t);var a=e.$on("fileUploadChange",function(){angular.element(i).val(null)});e.$on("$destroy",function(){i.off(),a()})}}}),angular.module("app").directive("highlightField",[function(){return{restrict:"A",scope:{highlightFn:"=",highlightField:"="},link:function(e,i,n){i.bind("keyup",function(i){e.highlightFn(e.highlightField)}),e.$on("$destroy",function(){i.unbind("keyup")})}}}]),angular.module("app").filter("bytes",function(){return function(e,i){if(isNaN(parseFloat(e))||!isFinite(e))return"-";"undefined"==typeof i&&(i=1);var n=["bytes","kB","MB","GB","TB","PB"],t=Math.floor(Math.log(e)/Math.log(1024));return(e/Math.pow(1024,Math.floor(t))).toFixed(i)+" "+n[t]}});