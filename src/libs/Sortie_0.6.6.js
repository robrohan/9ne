// (c) 2004-2006 Rob Rohan and Barney Boisvert. All Rights Reserved

Sortie={};Sortie.VERSION="0.5";Sortie.DEBUG=false;Sortie.CoreImpl=function(){this.__NEURO_REQUIRES=new Array();this.__NEURO_IMPORTS=new Array();this.__PRE_COMMAND_REQUIRE="require";this.__PRE_COMMAND_LOAD="include";this["$"]=function(e){if(typeof e[this.__PRE_COMMAND_REQUIRE]!="undefined"){this.__buildRequireStructure(e);}
if(typeof e[this.__PRE_COMMAND_LOAD]!="undefined"){this.__buildImportStructure(e)}};this.__buildImportStructure=function(e){var loadlen=e[this.__PRE_COMMAND_LOAD].length;for(var i=0;i<loadlen;i++){this.__NEURO_IMPORTS[this.__NEURO_IMPORTS.length]=e[this.__PRE_COMMAND_LOAD][i];}};this.__buildRequireStructure=function(e){var loadlen=e[this.__PRE_COMMAND_REQUIRE].length;for(var i=0;i<loadlen;i++){this.__NEURO_REQUIRES[this.__NEURO_REQUIRES.length]=e[this.__PRE_COMMAND_REQUIRE][i];}};this.VerifyDependencies=function(){var reqlen=this.__NEURO_REQUIRES.length;for(var i=0;i<reqlen;i++){var reqlib=this.__NEURO_REQUIRES[i];if(typeof eval(reqlib.c)=="undefined"){throw Error("Missing Library: "+reqlib.c);continue;}
if(typeof reqlib.v!="undefined"){var x=0;eval("x = "+reqlib.c+"['VERSION']");x=(parseFloat(x)!=Number.NaN)?parseFloat(x):parseFloat(0);if(x<parseFloat(reqlib.v)){throw Error("Bad Library Version: "+reqlib.c+" v:"+reqlib.v);}}}};this.Include=function(debug){var importlen=this.__NEURO_IMPORTS.length;for(var i=0;i<importlen;i++){var line="<script charset='utf-8' type='text/javascript' src='"
+this.__NEURO_IMPORTS[i]
+"'";if(debug)
log.debug(line+"></script"+">");else
document.write(line+"></script"+">");}
this.VerifyDependencies();};}
Sortie.Core=new Sortie.CoreImpl();Sortie.Core.VERSION="0.5";if(!Sortie.IO)Sortie.IO={};if(!Sortie.IO.Gateway)Sortie.IO.Gateway={};Sortie.Core.$({require:new Array({c:"Sortie.Util.Collections",v:"0.2"},{c:"Sortie.Util.Browser",v:"0.3"})});Sortie.IO.Pipe=function(){this.GetInstance=function(){var gw_http_request=null;if(window.ActiveXObject){try{gw_http_request=new ActiveXObject("Msxml2.XMLHTTP");}catch(e){try{gw_http_request=new ActiveXObject("Microsoft.XMLHTTP");}catch(ex){throw new Error("IE browser, but xmlhttp create failed: "+ex);}}}else{try{gw_http_request=new XMLHttpRequest();if(gw_http_request.readyState==null){gw_http_request.readyState=1;gw_http_request.addEventListener("load",function(){gw_http_request.readyState=4;if(typeof gw_http_request.onreadystatechange=="function")
gw_http_request.onreadystatechange();},false);}}catch(e){throw new Error("Gecko browser, but xmlhttp create failed: "+ex);}}
if(gw_http_request==null){throw new Error("HTTPConnect::createInstance(): Unable to create HTTPConnect object");}
return gw_http_request;};}
Sortie.IO.Gateway=function(connection,asyn){this.connection=connection;this.loading=false;this.async=asyn;this.username=null;this.password=null;this.DoRequest=function(params){this.loading=true;var conn=this.connection;var load=this.loading;var finaljsr=this;var finaltimeout=setTimeout("alert")
if(params.username!=null&&params.username!=null)
conn.open(params.method,params.url,this.async,params.username,params.password);else
conn.open(params.method,params.url,this.async);if(this.async){conn.onreadystatechange=function(){if(conn.readyState==4){if(conn.status==200){params.handler(conn);}else{try{params.error_handler(conn);}catch(e){throw Error(e);}}
finaljsr.loading=false;load=false;}}}
if(!params.body)
params.body="nothing";else{conn.setRequestHeader("Content-Length",""+params.body.length);if(params.body.indexOf("<?")==0)
conn.setRequestHeader("Content-Type","text/xml; charset="+((params.encoding)?params.encoding:"utf-8"));}
conn.setRequestHeader("XLibrary","Sorite 1.5");if(typeof params.extra_headers=="object"){for(var i in params.extra_headers){conn.setRequestHeader(i,params.extraHeaders[i]);}}
conn.send(params.body+"");if(!this.async){params.handler(conn);load=false;}};this.DoFormPostRequest=function(url,fields,handler){var body="";var headers=new Object();var boundary="neuro"+Math.random();for(var i in fields){body+="--"+boundary+"\nContent-Disposition: form-data;name=\""+i+"\"\n";body+="\n";body+=fields[i]+"\n";body+="\n";}
body+="--"+boundary+"--";headers["Content-Type"]="multipart/form-data; boundary="+boundary;this.doPostRequest(url,handler,body,headers);};}
Sortie.IO.Gateway["VERSION"]="0.2";if(!Sortie.UI)Sortie.UI={};Sortie.Core.$({require:new Array({c:"Sortie.Util.Browser",v:"0.2"})});Sortie.UI.EventManager=function(){this.onloadListeners=new Array();this.clickListeners=new Array();this.mdownListeners=new Array();this.mupListeners=new Array();this.moveListeners=new Array();this.keyDownListeners=new Array();this.keyUpListeners=new Array();this.keyPressListeners=new Array();this.doc=null;this.Init=function(docu){this.doc=docu;var emptr=this;this.doc.onmousemove=function(e){emptr._checkMove(e);}
this.doc.onmousedown=function(e){emptr._checkMDown(e);}
this.doc.onmouseup=function(e){emptr._checkMUp(e);}
this.doc.onclick=function(e){emptr._checkClick(e);}
this.doc.onkeydown=function(e){emptr._checkKeyDown(e);}
this.doc.onkeyup=function(e){emptr._checkKeyUp(e);}
this.doc.onkeypress=function(e){emptr._checkKeyPress(e);}}
this.AddLoadListener=function(func){this.__addListener(this.onloadListeners,func);}
this.AddMouseDownListener=function(func){this.__addListener(this.mdownListeners,func);}
this.AddMouseUpListener=function(func){this.__addListener(this.mupListeners,func);}
this.AddClickListener=function(func){this.__addListener(this.clickListeners,func);}
this.AddMoveListener=function(func){this.__addListener(this.moveListeners,func);}
this.AddKeyDownListener=function(func){this.__addListener(this.keyDownListeners,func);}
this.AddKeyUpListener=function(func){this.__addListener(this.keyUpListeners,func);}
this.AddKeyPressListener=function(func){this.__addListener(this.keyPressListeners,func);}
this.__addListener=function(arry,func){arry[arry.length]=func;}
this.__normalizeEvent=function(evt){if((!evt||evt==null||typeof evt=="undefined")&&Sortie.Util.Browser.Explorer){evt=window.event;}
if(typeof evt.target=="undefined"&&typeof evt.srcElement!="undefined"){evt.target=evt.srcElement;}
return evt;}
this._checkClick=function(e){e=this.__normalizeEvent(e);this.__fireEventListeners(this.clickListeners,e);return true;}
this._checkMDown=function(e){e=this.__normalizeEvent(e);this.__fireEventListeners(this.mdownListeners,e);if(e.target.tagName=="IMG"||e.target.className.indexOf("Item")>0){return false;}
return true;};this._checkMUp=function(e){e=this.__normalizeEvent(e);this.__fireEventListeners(this.mupListeners,e);return true;}
this._checkMove=function(e){e=this.__normalizeEvent(e);this.__fireEventListeners(this.moveListeners,e);return true;}
this._checkOnLoad=function(e){e=this.__normalizeEvent(e);this.__fireEventListeners(this.onloadListeners,e);}
this._checkKeyDown=function(e){e=this.__normalizeEvent(e);this.__fireEventListeners(this.keyDownListeners,e);return true;}
this._checkKeyUp=function(e){e=this.__normalizeEvent(e);this.__fireEventListeners(this.keyUpListeners,e);return true;}
this._checkKeyPress=function(e){e=this.__normalizeEvent(e);this.__fireEventListeners(this.keyPressListeners,e);return true;}
this.__fireEventListeners=function(arry,evt){var len=arry.length;for(var i=0;i<len;i++){try{arry[i](evt);}catch(e){alert(e);}}}
this.GetKeyCodeFromEvent=function(evt){if(Sortie.Util.Browser.Explorer)
return evt.keyCode;else if(Sortie.Util.Browser.Gecko||Sortie.Util.Browser.Safari)
return evt.which;}
this.GetKeyFromEvent=function(evt){return String.fromCharCode(this.GetKeyCodeFromEvent(evt));}}
Sortie.UI.EventManager["VERSION"]="0.2";if(!Sortie.UI)Sortie.UI={};Sortie.UI.MouseImpl=function(){this.X=0;this.Y=0;this.SetCoords=function(e){if(typeof(e.pageX)=='number'){var xcoord=e.pageX;var ycoord=e.pageY;}else{if(typeof(e.clientX)=='number'){var xcoord=e.clientX;var ycoord=e.clientY;if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){xcoord+=document.body.scrollLeft;ycoord+=document.body.scrollTop;}else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop))
{xcoord+=document.documentElement.scrollLeft;ycoord+=document.documentElement.scrollTop;}}else{return;}}
this.X=xcoord;this.Y=ycoord;};}
Sortie.UI.Mouse=new Sortie.UI.MouseImpl();Sortie.UI.Mouse["VERSION"]="0.2";if(!Sortie.UI)Sortie.UI={};Sortie.UI.Screen=function(){this.FindPosX=function(obj){var curleft=0;if(obj.offsetParent){while(1){curleft+=obj.offsetLeft;if(!obj.offsetParent)
break;obj=obj.offsetParent;}}else if(obj.x){curleft+=obj.x;}
return curleft;};this.FindPosY=function(obj){var curtop=0;if(obj.offsetParent){while(1){curtop+=obj.offsetTop;if(!obj.offsetParent)
break;obj=obj.offsetParent;}}else if(obj.y){curtop+=obj.y;}
return curtop;};}
Sortie.UI.Screen["VERSION"]="0.1";if(!Sortie.Util)Sortie.Util={};if(!Sortie.Util.Browser)Sortie.Util.Browser={};Sortie.Util.Browser.Safari=((navigator.userAgent.indexOf("Safari")>-1)&&(navigator.userAgent.indexOf("Mac")>-1));Sortie.Util.Browser.Gecko=(!this.Safari&&(document.getElementById&&!document.all));Sortie.Util.Browser.Explorer=((typeof document.all!="undefined")&&(navigator.userAgent.indexOf("Opera")==-1));Sortie.Util.Browser.Opera=(navigator.userAgent.indexOf("Opera")>-1);Sortie.Util.Browser.Windows=((navigator.appVersion.indexOf("Win")!=-1));Sortie.Util.Browser.Mac=((navigator.appVersion.indexOf("Mac")!=-1));Sortie.Util.Browser.Linux=((navigator.appVersion.indexOf("Linux")!=-1));Sortie.Util.Browser.Unix=((navigator.appVersion.indexOf("X11")!=-1));Sortie.Util.Browser["VERSION"]="0.3";if(!Sortie.Util)Sortie.Util={};if(!Sortie.Util.Collections)Sortie.Util.Collections={};Sortie.Util.Collection=function(){this.avalues=new Array();this.asize=-1;this.Size=function(){return this.asize+1;};this.Clear=function(){this.avalues=null;this.avalues=new Array();this.asize=-1;};this.ToArray=function(){return this.avalues;};this.Contains=function(o){if(this.IndexOf(o)>=0){return true;}
return false;};this.IndexOf=function(o){var l_x=0;for(;l_x<this.Size();l_x++){if(this.avalues[l_x]==o){return l_x;}}
return-1;};this.IsEmpty=function(){if(this.asize==-1)
return true;return false;};this.LastIndexOf=function(o){var indx=-1;var l_x=0;for(;l_x<this.Size();l_x++){if(this.avalues[l_x]==o){indx=l_x;}}
return indx;};this.Get=function(index){if(index>this.Size()||index<0){throw new Error("Collection.get : index is > size or < 0 can't get element");}
return this.avalues[index];};this.Remove=function(o){var idx=this.IndexOf(o);this.RemoveByIndex(idx);};this.RemoveByIndex=function(index){if(index>this.asize)
throw new Error("Collection.remove : index is > size can't remove element");this.avalues.splice(index,1);this.asize--;};this.Set=function(index,element){if(index>this.asize)
throw new Error("Collection.set : index is > size can't set element");this.avalues[index]=element;};this.ToString=function(){var z=0;var str="[";var con="";if(this.IsEmpty()){con="Empty";}else{for(;z<this.Size();z++){con+=this.avalues[z]+",";}
con=con.substring(con,con.length-1);}
str+=con+"]"
return str;};}
Sortie.Util.List=function(){this.avalues=new Array();this.asize=-1;this.Add=function(o){this.asize++;this.avalues[this.asize]=o;};this.ToThinList=function(sep){return this.avalues.join(sep)};this.FromThinList=function(list,sep){this.avalues=null;this.avalues=list.split(sep);this.asize=this.avalues.length-1;};this.ToString=function(){var z=0;var str="[";var con="";if(this.IsEmpty()){con="empty";}else{con=this.ToThinList(",");}
str+=con+"]"
return str;};this.ToWSArray=function(varname,type){var wsstr="<"+varname;wsstr+=" xsi:type=\"soapenc:Array\" soapenc:arrayType=\"ns2:anyType["+this.Size()+"]\">";for(v=0;v<this.Size();v++){wsstr+="<item xsi:type=\"ns2:string\">"+this.avalues[v].toString()+"</item>";}
wsstr+="</"+varname+"> ";return wsstr;};}
Sortie.Util.List.prototype=new Sortie.Util.Collection();Sortie.Util.Set=function()
{this.avalues=new Array();this.asize=-1;this.Add=function(o){if(!this.Contains(o)&&o!=null&&typeof o!="undefined"){this.asize++;this.avalues[this.asize]=o;}};}
Sortie.Util.Set.prototype=new Sortie.Util.Collection();Sortie.Util.Map=function()
{this.aname=new Array();this.avalue=new Array();this.asize=-1;this.Put=function(nkey,nvalue){if(this.Contains(nkey)){this.Remove(nkey);}
this.asize++;this.aname[this.asize]=nkey;this.avalue[this.asize]=nvalue;};this.GetKeysAsArray=function(){return this.aname;};this.Get=function(keyname){var m_x=0;for(;m_x<this.Size();m_x++){if(this.aname[m_x]==keyname){return this.avalue[m_x];}}
return null;};this.Remove=function(key){var idx=this.IndexOf(key);this.RemoveByIndex(idx);};this.Contains=function(keyname){var s=this.Size();var m_i=0;for(;m_i<s;m_i++){if(this.aname[m_i]==keyname){return true;}}
return false;};this.ContainsNoCase=function(keyname){var s=this.Size();var m_i=0;for(;m_i<s;m_i++){var re=new RegExp(this.aname[m_i],"i");var a=keyname.match(re);if(a!=null&&a.length>0){return true;}}
return false;};this.IndexOf=function(key){var l_x=0;for(;l_x<this.Size();l_x++){if(this.aname[l_x]==key){return l_x;}}
return-1;};this.RemoveByIndex=function(index){if(index>this.asize)
throw new Error("Map remove index is > size can't remove key/value");this.aname.splice(index,1);this.avalue.splice(index,1);this.asize--;};this.Size=function(){return this.asize+1;};this.ToWSStruct=function(varname,id,depth)
{var frag="<"+varname+" xsi:type=\"ns2:Map\" xmlns:ns2=\"http://xml.apache.org/xml-soap\">";frag+=this.__recurse_map();frag+="</"+varname+">";return frag;};this.__recurse_map=function(){var wsstr="";for(var z=0;z<this.aname.length;z++)
{wsstr+="<item>";wsstr+="<key xsi:type=\"xsd:string\">"+this.aname[z].toString()+"</key>";if(this.avalue[z]==null||typeof this.avalue==undefined)
{wsstr+="<value xsi:type=\"xsd:string\" />";}
else if(this.avalue[z]instanceof Map)
{wsstr+="<value xsi:type=\"ns2:Map\">"
wsstr+=this.avalue[z].__recurse_map();wsstr+="</value>"}
else
{wsstr+="<value xsi:type=\"xsd:string\">"+this.avalue[z].toString()+"</value>";}
wsstr+="</item>";}
return wsstr;};this.ToString=function(){var str="[";if(this.Size()>0){var m_x=0;for(;m_x<this.Size();m_x++){str+=this.aname[m_x]+"="+this.avalue[m_x]+",";}
str=str.substring(0,str.length-1);}else{str+="empty"}
str+="]";return str;};};Sortie.Util.Collections["VERSION"]="0.2";if(!Sortie.Util)Sortie.Util={};Sortie.Util.Cookie=function(){this.GetCookie=function(name){var start=document.cookie.indexOf(name+"=");var len=start+name.length+1;if((!start)&&(name!=document.cookie.substring(0,name.length)))
return null;if(start==-1)
return null;var end=document.cookie.indexOf(";",len);if(end==-1)end=document.cookie.length;return unescape(document.cookie.substring(len,end));};this.SetCookie=function(name,value,expires,path,domain,secure){this.SetRawCookie(name+"="+escape(value)+
((expires)?";expires="+expires.toGMTString():"")+
((path)?";path="+path:"")+
((domain)?";domain="+domain:"")+
((secure)?";secure":""));};this.RemoveCookie=function(name,path,domain,secure){var thepast=new Date();thepast.setYear(thepast.getYear()-2);this.SetCookie(name,"",thepast,path,domain,secure);};this.SetPermCookie=function(name,value,path,domain,secure){var thefuture=new Date();var year=(thefuture.getYear()<1000)?thefuture.getYear()+1900:thefuture.getYear();thefuture.setYear(year+5);this.SetCookie(name,value,thefuture,path,domain,secure);};this.SetRawCookie=function(cookie){document.cookie=cookie;};}
Sortie.Util.Cookie["VERSION"]="0.5";if(!Sortie.Util)Sortie.Util={};Sortie.Util.Log=function(){this.NEW_WINDOW=0;this.TEXT_AREA=1;this.STRING_BUFFER=2;this.CONSOLE=3;this.USER_DIV=4;this.TYPE_DEBUG="DEBUG";this.TYPE_WARN="WARN";this.TYPE_INFO="INFO";this.TYPE_ERROR="ERROR";this.running=false;this.textele_handle=null;this.logbuffer="";this.type=this.NEW_WINDOW;this.Init=function(){if(Sortie.DEBUG){switch(this.type){case this.NEW_WINDOW:this.__openwindow();break;case this.CONSOLE:this.__linkdiv();break;case this.USER_DIV:this.__linkinlinediv();break;}
this.running=true;this.Info("Log (re)init...",this);}};this.Redirect=function(to){this.type=to;};this.__linkdiv=function(){this.output_handle=window;this.textele_handle=document.getElementById("neurostdout");};this.__linkinlinediv=function(){this.output_handle=window;this.textele_handle=document.getElementById("neurolog");if(this.textele_handle==null||typeof this.textele_handle=="undefined"){alert("Warning: log set to output to a div with an id of 'neurolog', but no div was found. \n Log items will go nowhere.");}};this.__openwindow=function(){var wndptr=window.open('','Log_Viewer','height=630,width=550,scrollbars=yes,resizable=yes,left=300,top=100,status=no,toolbar=no,location=no');wndptr.document.open();wndptr.document.write('<html><head><style type="text/css">.error{ color: red; } .info{ color: navy; } .warn{ color: yellow; } .debug{ color: black; }</style></head><body style="margin: 1px;"></body></html>');wndptr.document.close();bdy=wndptr.document.getElementsByTagName("body");toolbarele=wndptr.document.createElement("div");toolbarele.setAttribute("id","LogToolBar");toolbarele.setAttribute("style","background-color: silver; padding: 0px; margin: 0px; width: 100%; top: 0px; position: fixed !important; position: absolute; white-space: nowrap; z-Index: 1000000;");toolbarele.innerHTML="<input type='button' value='Clear' onclick='document.getElementById(\"LogText\").innerHTML=\"\";' title='Clear'>";logtextele=wndptr.document.createElement("div");logtextele.setAttribute("id","LogText");logtextele.setAttribute("style","top: 22px; width: 100%; height: 96%; position: relative;");bdy.item(0).appendChild(toolbarele);bdy.item(0).appendChild(logtextele);this.textele_handle=logtextele;this.output_handle=wndptr;};this.__write=function(type,object,line)
{if(this.running==false)return;if(typeof object=="undefined")object="NO OBJECT";if(this.type==this.NEW_WINDOW){if(!this.output_handle.document){this.__openwindow();}}
var date=new Date();var datestring=(date.getYear()<1900)?date.getYear()+1900:date.getYear();datestring+="-"+(date.getMonth()+1)
datestring+="-"+date.getDate();datestring+=" "
+date.getHours()+":"
+((date.getMinutes()>=10)?date.getMinutes():"0"+date.getMinutes())+":"
+((date.getSeconds()>=10)?date.getSeconds():"0"+date.getSeconds());var newline=null;if(this.output_handle!=null)
newline=this.output_handle.document.createElement("div");else
newline=document.createElement("div");switch(type){case this.TYPE_DEBUG:newline.setAttribute("class","debug");break;case this.TYPE_INFO:newline.setAttribute("class","info");break;case this.TYPE_WARN:newline.setAttribute("class","warn");break;case this.TYPE_ERROR:newline.setAttribute("class","error");break;}
newline.innerHTML="["+datestring+"] "+type+" :: "+(typeof object)+" :: "+line;this.textele_handle.appendChild(newline);this.output_handle.scrollTo(0,this.textele_handle.scrollHeight);};this.Debug=function(line,object){this.__write(this.TYPE_DEBUG,object,line);};this.Info=function(line,object){this.__write(this.TYPE_INFO,object,line);};this.Warn=function(line,object){this.__write(this.TYPE_WARN,object,line);};this.Error=function(line,object){this.__write(this.TYPE_ERROR,object,line);};}
Sortie.Util.Log["VERSION"]="0.2";if(!Sortie.Util)Sortie.Util={};Sortie.Core.$({require:new Array({c:"Sortie.Util.Collections",v:"0.2"})});Sortie.Util.Properties=function(){this.map=new Sortie.Util.Map();this.Parse=function(str){var alllines=str.split("\n");for(var z=0;z<alllines.length;z++){currentline=alllines[z].toString().replace(/#.*$/g,"");if(currentline=="")
continue;var parts=this.SplitNameValue(currentline)
this.map.Put(parts[0],parts[1]);}};this.SplitNameValue=function(nvpair){var nv=new Array();nv=nvpair.split("=");if(nv.length==2){return nv;}else if(nv.length==1){nv[1]="";return nv;}else if(nv.length>2){var value="";for(z=1;z<nv.length;z++){value+=nv[z]+"=";}
return new Array(nv[0],value.substring(0,value.length-1));}else{}}
this.PropertyNames=function()
{return this.map.GetKeysAsArray();};this.GetProperty=function(key,defaultValue){var value=this.map.Get(key);if(value==null){if(defaultValue!=null&&typeof defaultValue!="undefined"){value=defaultValue;}}
return value;};this.SetProperty=function(key,value){this.map.Put(key,value);};this.Store=function(style,header){var mapkeys=this.map.GetKeysAsArray();var propfile=(header==null)?"":header;var value="";for(var z=0;z<mapkeys.length;z++){propfile+=mapkeys[z];value=this.map.Get(mapkeys[z]);propfile+="=";if(style==2){propfile+=escape(value);}else{propfile+=value;}
if(z!=(mapkeys.length-1))
propfile+="\n";}
return propfile;};}
Sortie.Util.Properties["VERSION"]="0.2";if(!Sortie.Util)Sortie.Util={};if(!Sortie.Util.Search)Sortie.Util.Search={};Sortie.Util.BinarySearch=function(){this.HitArea=function(){this.upper=0;this.lower=0;this.match=0;this.toString=function(){return"Match: "+this.match+" Lower: "+this.lower+" Upper: "+this.upper;}};this.Search=function(array,lower,upper,key){for(;;){var m=parseInt((lower+upper)>>1);if(key<array[m]){upper=m-1;}else if(key>array[m]){lower=m+1;}else{ha=new this.HitArea();ha.upper=upper;ha.lower=lower
ha.match=m;return ha;}if(lower>upper){ha=new this.HitArea();ha.upper=upper;ha.lower=lower;ha.match=-1;return ha;}}}}
Sortie.Util.Search["VERSION"]="0.5";if(!Sortie.Util)Sortie.Util={};if(!Sortie.Util.Sort)Sortie.Util.Sort={};Sortie.Util.QuickSort=function(){this.Sort=function(arry,left,right){if(left<right){var part=this.__qsort_split(arry,left,right);this.Sort(arry,left,part-1);this.Sort(arry,part+1,right);}};this.__qsort_split=function(arry,left,right){var pivot,i,j,t;pivot=arry[left];i=left;j=right+1;for(;;){do++i;while(arry[i]<=pivot&&i<=right);do--j;while(arry[j]>pivot);if(i>=j)
break;t=arry[i];arry[i]=arry[j];arry[j]=t;}
t=arry[left];arry[left]=arry[j];arry[j]=t;return j;};}
Sortie.Util.Sort["VERSION"]="0.5";if(!Sortie.Util)Sortie.Util={};Sortie.Util.Text=function(){this.NEWLINE="\n";this.XmlFormat=function(str){str=str.replace(/&/g,"&amp;");str=str.replace(/</g,"&lt;");str=str.replace(/>/g,"&gt;");return str;};this.UnXmlFormat=function(str){var clean=str.replace(/&nbsp;/g," ");clean=clean.replace(/&lt;/g,"<");clean=clean.replace(/&gt;/g,">");clean=clean.replace(/&amp;/g,"&");return clean;}
this.ParseBoolean=function(str){if(str==null||typeof str=="undefined")
return false;if(str.toString()=="TRUE"||str.toString()=="true")
return true;return false;};this.Reflect=function(obj){var str=this.NEWLINE+"("+typeof obj+")";for(var i in obj){if(i.toString().charAt(0)!="_"){str+=this.NEWLINE+typeof obj[i]+" :: "+i;}}
return str;};this.ExpandError=function(e){var stamp=this.NEWLINE;stamp+="Name: "+e.name+this.NEWLINE;stamp+="Desc: "+e.description+this.NEWLINE;stamp+="Number: "+e.number+this.NEWLINE;stamp+="Message: "+e.message+this.NEWLINE;stamp+="Proto: "+e.prototype+this.NEWLINE;stamp+="Const: "+e.constructor+this.NEWLINE;return stamp;}}
Sortie.Util.Text["VERSION"]="0.1";