import{o as n,c as e,m as i,r as o,l as t,u as r}from"./vendor.12a5b039.js";const s={class:"markdown-body"},a=[i('<h1>EngineConnPlugin installation document</h1><p>This article mainly introduces the use of Linkis EngineConnPlugins, mainly from the aspects of compilation and installation.</p><h2>1. Compilation and packaging of EngineConnPlugins</h2><p>After linkis1.0, the engine is managed by EngineConnManager, and the EngineConnPlugin (ECP) supports real-time effectiveness. In order to facilitate the EngineConnManager to be loaded into the corresponding EngineConnPlugin by labels, it needs to be packaged according to the following directory structure (take hive as an example):</p><pre><code>hive: engine home directory, must be the name of the engine\n└── dist # Dependency and configuration required for engine startup, different versions of the engine need to be in this directory to prevent the corresponding version directory\n    └── v1.2.1 #Must start with ‘v’ and add engine version number ‘1.2.1’\n        └── conf # Configuration file directory required by the engine\n        └── lib # Dependency package required by EngineConnPlugin\n└── plugin #EngineConnPlugin directory, this directory is used for engine management service package engine startup command and resource application\n    └── 1.2.1 # Engine version\n        └── linkis-engineplugin-hive-1.0.0-RC1.jar #Engine module package (only need to place a separate engine package)\n</code></pre><p>If you are adding a new engine, you can refer to hive’s assembly configuration method, source code directory: linkis-engineconn-plugins/engineconn-plugins/hive/src/main/assembly/distribution.xml</p><h2>2. Engine Installation</h2><h3>2.1 Plugin package installation</h3><p>1.First, confirm the dist directory of the engine: wds.linkis.engineconn.home (get the value of this parameter from ${LINKIS_HOME}/conf/linkis.properties), this parameter is used by EngineConnPluginServer to read the configuration file that the engine depends on And third-party Jar packages. If the parameter (wds.linkis.engineconn.dist.load.enable=true) is set, the engine in this directory will be automatically read and loaded into the Linkis BML (material library).</p><p>2.Second, confirm the engine Jar package directory: wds.linkis.engineconn.plugin.loader.store.path, which is used by EngineConnPluginServer to read the actual implementation Jar of the engine.</p><p>It is highly recommended to specify <strong>wds.linkis.engineconn.home and wds.linkis.engineconn.plugin.loader.store.path as</strong> the same directory, so that you can directly unzip the engine ZIP package exported by maven into this directory, such as: Place it in the ${LINKIS_HOME}/lib/linkis-engineconn-plugins directory.</p><pre><code>${LINKIS_HOME}/lib/linkis-engineconn-plugins:\n└── hive\n    └── dist\n    └── plugin\n└── spark\n    └── dist\n    └── plugin\n</code></pre><p>If the two parameters do not point to the same directory, you need to place the dist and plugin directories separately, as shown in the following example:</p><pre><code>## dist directory\n${LINKIS_HOME}/lib/linkis-engineconn-plugins/dist:\n└── hive\n    └── dist\n└── spark\n    └── dist\n## plugin directory\n${LINKIS_HOME}/lib/linkis-engineconn-plugins/plugin:\n└── hive\n    └── plugin\n└── spark\n    └── plugin\n</code></pre><h3>2.2 Configuration modification of management console (optional)</h3><p>The configuration of the Linkis1.0 management console is managed according to the engine label. If the new engine has configuration parameters, you need to insert the corresponding configuration parameters in the Configuration, and you need to insert the parameters in three tables:</p><pre><code>linkis_configuration_config_key: Insert the key and default values of the configuration parameters of the engin\nlinkis_manager_label: Insert engine label such as hive-1.2.1\nlinkis_configuration_category: Insert the catalog relationship of the engine\nlinkis_configuration_config_value: Insert the configuration that the engine needs to display\n</code></pre><p>If it is an existing engine and a new version is added, you can modify the version of the corresponding engine in the linkis_configuration_dml.sql file for execution</p><h3>2.3 Engine refresh</h3><ol><li><p>The engine supports real-time refresh. After the engine is placed in the corresponding directory, Linkis1.0 provides a method to load the engine without shutting down the server, and just send a request to the linkis-engineconn-plugin-server service through the restful interface, that is, the actual deployment of the service Ip+port, the request interface is <a href="http://ip">http://ip</a>:port/api/rest_j/v1/rpc/receiveAndReply, the request method is POST, the request body is {“method”:“/enginePlugin/engineConn/refreshAll”}.</p></li><li><p>Restart refresh: the engine catalog can be forced to refresh by restarting</p></li></ol><pre><code>### cd to the sbin directory, restart linkis-engineconn-plugin-server\ncd /Linkis1.0.0/sbin\n## Execute linkis-daemon script\nsh linkis-daemon.sh restart linkis-engine-plugin-server\n</code></pre><p>3.Check whether the engine refresh is successful: If you encounter problems during the refresh process and need to confirm whether the refresh is successful, you can check whether the last_update_time of the linkis_engine_conn_plugin_bml_resources table in the database is the time when the refresh is triggered.</p>',22)],l={setup:(i,{expose:o})=>(o({frontmatter:{}}),(i,o)=>(n(),e("div",s,a)))},g={class:"markdown-body"},p=[i('<h1>引擎插件安装文档</h1><blockquote><p>本文主要介绍Linkis引擎插件的使用，主要从编译、安装等方面进行介绍</p></blockquote><h2>1. 引擎插件的编译打包</h2><p>    在linkis1.0以后，引擎是由EngineConnManager进行管理的，引擎插件（EngineConnPlugin）支持实时生效。</p><p>为了方便 EngineConnManager 能够通过标签加载到对应的引擎插件，需要按照如下目录结构进行打包(以hive为例)：</p><p><strong>请注意： 因为现在标签是通过-来进行拆分值的所以版本里面不能出现-如果出现可以通过用其他符号代替，比如engineType：hvie-cdh-2.3.3，会拆分错，您可以直接使用这个：hive-2.3.3，</strong></p><pre><code>hive:引擎主目录，必须为引擎的名字\n    └── dist  # 引擎启动需要的依赖和配置，引擎不同的版本需要在该目录防止对应的版本目录\n      └── v2.3.3 #必须以v开头加上引擎版本号2.3.3\n           └── conf # 引擎需要的配置文件目录\n           └── lib  # 引擎插件需要的依赖包\n    └── plugin #引擎插件目录，该目录用于引擎管理服务封装引擎的启动命令和资源申请\n      └── 2.3.3 # 引擎版本,没有V开头\n        └── linkis-engineplugin-hive-1.0.0.jar  #引擎模块包（只需要放置单独的引擎包）\n</code></pre><p>如果您是新增引擎，你可以参考hive的assembly配置方式，源码目录：<code>linkis-engineconn-plugins/engineconn-plugins/hive/src/main/assembly/distribution.xml</code></p><h2>2. 引擎安装</h2><h3>2.1 插件包安装</h3><ol><li><p>首先，确认引擎的dist目录：wds.linkis.engineconn.home（从${LINKIS_HOME}/conf/linkis.properties中获取该参数的值），该参数为 EngineConnPluginServer 用于读取引擎启动所依赖的配置文件和第三方Jar包。如果设置了参数（wds.linkis.engineconn.dist.load.enable=true），会自动读取并加载该目录下的引擎到Linkis BML（物料库）中。</p></li><li><p>其次，确认引擎Jar包目录：wds.linkis.engineconn.plugin.loader.store.path，该目录用于 EngineConnPluginServer 读取该引擎的实际实现Jar。</p></li><li><p><strong>强烈推荐 wds.linkis.engineconn.home 和 wds.linkis.engineconn.plugin.loader.store.path 指定为同一个目录</strong>，这样就可以直接将maven打出来的引擎ZIP包，解压到该目录下，如：放置到${LINKIS_HOME}/lib/linkis-engineconn-plugins目录下。</p></li></ol><pre><code>${LINKIS_HOME}/lib/linkis-engineconn-plugins:\n└── hive\n   └── dist\n   └── plugin\n└── spark\n   └── dist\n   └── plugin\n</code></pre><ol start="4"><li>如果两个参数不是指向同一个目录，则需要分开放置dist和plugin目录，如下示例：</li></ol><pre><code>## dist 目录\n${LINKIS_HOME}/lib/linkis-engineconn-plugins/dist:\n└── hive\n   └── dist\n└── spark\n   └── dist\n \n## plugin 目录\n${LINKIS_HOME}/lib/linkis-engineconn-plugins/plugin:\n└── hive\n   └── plugin\n└── spark\n   └── plugin\n</code></pre><ol start="5"><li>并配置默认的引擎版本，方便没有带版本的任务进行提交 <code>wds.linkis.hive.engine.version=2.3.3</code></li></ol><h3>2.2 管理台Configuration配置修改（可选）</h3><p>    Linkis1.0 管理台的配置是按照引擎标签来进行管理的，如果新增的引擎有配置参数需要在Configuration插入相应的配置参数，需要在三个表中插入参数：</p><pre><code>linkis_configuration_config_key:  插入引擎的配置参数的key和默认values\nlinkis_manager_label：插入引擎label如：hive-2.3.3\nlinkis_configuration_category： 插入引擎的目录关联关系\nlinkis_configuration_config_value： 插入引擎需要展示的配置\n</code></pre><p>如果是已经存在的引擎，新增版本，则可以修改linkis_configuration_dml.sql文件下的对应引擎的版本进行执行</p><h3>2.3 引擎刷新</h3><ol><li>引擎支持实时刷新，引擎放置到对应目录后，Linkis1.0提供了不关服热加载引擎的方法，通过restful接口向linkis-engineconn-plugin-server服务发送请求即可。</li></ol><ul><li><p>接口 <code>http://${engineconn-plugin-server-IP}:${port}/api/rest_j/v1/rpc/receiveAndReply</code></p></li><li><p>请求方式 <code>POST</code></p></li></ul><pre><code class="language-json">{\n  &quot;method&quot;: &quot;/enginePlugin/engineConn/refreshAll&quot;\n}\n</code></pre><ol start="2"><li>重启刷新：通过重启也可以强制刷新引擎目录</li></ol><pre><code class="language-bash">### cd到sbin目录下，重启linkis-engineconn-plugin-server\n\ncd ${LINKIS_HOME}/sbin\n\n## 执行linkis-daemon脚本\n\nsh linkis-daemon.sh restart cg-engineplugin\n\n</code></pre><ol start="3"><li>检查引擎是否刷新成功：如果在刷新过程中遇到问题，需要确认是否刷新成功，则可以查看数据库中的linkis_engine_conn_plugin_bml_resources这张表的last_update_time是否为触发刷新的时间。</li></ol>',26)],c={setup:(i,{expose:o})=>(o({frontmatter:{}}),(i,o)=>(n(),e("div",g,p)))},d={setup(e){const i=o(localStorage.getItem("locale")||"en");return(e,o)=>"en"===i.value?(n(),t(r(l),{key:0})):(n(),t(r(c),{key:1}))}};export{d as default};
