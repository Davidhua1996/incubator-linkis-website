import{o as t,c as e,m as d,r as a,l as i,u as o}from"./vendor.12a5b039.js";const r={class:"markdown-body"},n=[d('<h1>Linkis-Cli usage documentation</h1><h2>Introduction</h2><p>Linkis-Cli is a shell command line program used to submit tasks to Linkis.</p><h2>Basic case</h2><p>You can simply submit a task to Linkis by referring to the example below</p><p>The first step is to check whether the default configuration file <code>linkis-cli.properties</code> exists in the conf/ directory, and it contains the following configuration:</p><pre><code class="language-properties">   wds.linkis.client.common.gatewayUrl=http://127.0.0.1:9001\n   wds.linkis.client.common.authStrategy=token\n   wds.linkis.client.common.tokenKey=Validation-Code\n   wds.linkis.client.common.tokenValue=BML-AUTH\n</code></pre><p>The second step is to enter the linkis installation directory and enter the command:</p><pre><code class="language-bash">    ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -code &quot;select count(*) from testdb.test;&quot;  -submitUser hadoop -proxyUser hadoop \n</code></pre><p>In the third step, you will see the information on the console that the task has been submitted to linkis and started to execute.</p><p>Linkis-cli currently only supports synchronous submission, that is, after submitting a task to linkis, it will continue to inquire about the task status and pull task logs until the task ends. If the status is successful at the end of the task, linkis-cli will also actively pull the result set and output it.</p><h2>How to use</h2><pre><code class="language-bash">   ./bin/linkis-client [parameter] [cli parameter]\n</code></pre><h2>Supported parameter list</h2><ul><li><p>cli parameters</p><table><thead><tr><th>Parameter</th><th>Description</th><th>Data Type</th><th>Is Required</th></tr></thead><tbody><tr><td>–gwUrl</td><td>Manually specify the linkis gateway address</td><td>String</td><td>No</td></tr><tr><td>–authStg</td><td>Specify authentication policy</td><td>String</td><td>No</td></tr><tr><td>–authKey</td><td>Specify authentication key</td><td>String</td><td>No</td></tr><tr><td>–authVal</td><td>Specify authentication value</td><td>String</td><td>No</td></tr><tr><td>–userConf</td><td>Specify the configuration file location</td><td>String</td><td>No</td></tr></tbody></table></li><li><p>Parameters</p><table><thead><tr><th>Parameter</th><th>Description</th><th>Data Type</th><th>Is Required</th></tr></thead><tbody><tr><td>Parameter</td><td>Description</td><td>Data Type</td><td>Is Required</td></tr><tr><td>-----------</td><td>--------------------------</td><td>--------</td><td>----</td></tr><tr><td>-engType</td><td>Engine Type</td><td>String</td><td>Yes</td></tr><tr><td>-runType</td><td>Execution Type</td><td>String</td><td>Yes</td></tr><tr><td>-code</td><td>Execution code</td><td>String</td><td>No</td></tr><tr><td>-codePath</td><td>Local execution code file path</td><td>String</td><td>No</td></tr><tr><td>-smtUsr</td><td>Specify the submitting user</td><td>String</td><td>No</td></tr><tr><td>-pxyUsr</td><td>Specify the execution user</td><td>String</td><td>No</td></tr><tr><td>-creator</td><td>Specify creator</td><td>String</td><td>No</td></tr><tr><td>-scriptPath</td><td>scriptPath</td><td>String</td><td>No</td></tr><tr><td>-outPath</td><td>Path of output result set to file</td><td>String</td><td>No</td></tr><tr><td>-confMap</td><td>configuration map</td><td>Map</td><td>No</td></tr><tr><td>-varMap</td><td>variable map for variable substitution</td><td>Map</td><td>No</td></tr><tr><td>-labelMap</td><td>linkis labelMap</td><td>Map</td><td>No</td></tr><tr><td>-sourceMap</td><td>Specify linkis sourceMap</td><td>Map</td><td>No</td></tr></tbody></table></li></ul><h2>Detailed example</h2><h4>One, add cli parameters</h4><p>Cli parameters can be passed in manually specified, this way will overwrite the conflicting configuration items in the default configuration file</p><pre><code class="language-bash">    ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -code &quot;select count(*) from testdb.test;&quot; -submitUser hadoop -proxyUser hadoop --gwUrl http://127.0.0.1:9001- -authStg token --authKey [tokenKey] --authVal [tokenValue]\n</code></pre><h4>Two, add engine initial parameters</h4><p>The initial parameters of the engine can be added through the <code>-confMap</code> parameter. Note that the data type of the parameter is Map. The input format of the command line is as follows:</p><pre><code>    -confMap key1=val1,key2=val2,...\n</code></pre><p>For example: the following example sets startup parameters such as the yarn queue for engine startup and the number of spark executors:</p><pre><code class="language-bash">   ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -confMap wds.linkis.yarnqueue=q02,spark.executor.instances=3 -code &quot;select count(*) from testdb.test;&quot;  -submitUser hadoop -proxyUser hadoop  \n</code></pre><p>Of course, these parameters can also be read in a configuration file, we will talk about it later</p><h4>Three, add tags</h4><p>Labels can be added through the <code>-labelMap</code> parameter. Like the <code>-confMap</code>, the type of the <code>-labelMap</code> parameter is also Map:</p><pre><code class="language-bash">   /bin/linkis-client -engineType spark-2.4.3 -codeType sql -labelMap labelKey=labelVal -code &quot;select count(*) from testdb.test;&quot;  -submitUser hadoop -proxyUser hadoop  \n</code></pre><h4>Fourth, variable replacement</h4><p>Linkis-cli variable substitution is realized by <code>${}</code> symbol and <code>-varMap</code></p><pre><code class="language-bash">   ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -code &quot;select count(*) from \\${key};&quot; -varMap key=testdb.test  -submitUser hadoop -proxyUser hadoop  \n</code></pre><p>During execution, the sql statement will be replaced with:</p><pre><code class="language-mysql-sql">   select count(*) from testdb.test\n</code></pre><p>Note that the escape character in <code>&#39;\\$&#39;</code> is to prevent the parameter from being parsed in advance by linux. If <code>-codePath</code> specifies the local script mode, the escape character is not required</p><h4>Five, use user configuration</h4><ol><li>linkis-cli supports loading user-defined configuration files, the configuration file path is specified by the <code>--userConf</code> parameter, and the configuration file needs to be in the file format of <code>.properties</code></li></ol><pre><code class="language-bash">   ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -code &quot;select count(*) from testdb.test;&quot;  -submitUser hadoop -proxyUser hadoop  --userConf [配置文件路径]\n</code></pre><ol start="2"><li>Which parameters can be configured?</li></ol><p>All parameters can be configured, for example:</p><p>cli parameters:</p><pre><code class="language-properties">   wds.linkis.client.common.gatewayUrl=http://127.0.0.1:9001\n   wds.linkis.client.common.authStrategy=static\n   wds.linkis.client.common.tokenKey=[tokenKey]\n   wds.linkis.client.common.tokenValue=[tokenValue]\n</code></pre><p>parameter:</p><pre><code class="language-properties">   wds.linkis.client.label.engineType=spark-2.4.3\n   wds.linkis.client.label.codeType=sql\n</code></pre><p>When the Map class parameters are configured, the format of the key is</p><pre><code>    [Map prefix] + [key]\n</code></pre><p>The Map prefix includes:</p><ul><li>ExecutionMap prefix: wds.linkis.client.exec</li><li>sourceMap prefix: wds.linkis.client.source</li><li>ConfigurationMap prefix: wds.linkis.client.param.conf</li><li>runtimeMap prefix: wds.linkis.client.param.runtime</li><li>labelMap prefix: wds.linkis.client.label</li></ul><p>Note:</p><ol><li><p>variableMap does not support configuration</p></li><li><p>When there is a conflict between the configured key and the key entered in the command parameter, the priority is as follows:</p><pre><code> Instruction Parameters&gt; Key in Instruction Map Type Parameters&gt; User Configuration&gt; Default Configuration\n</code></pre></li></ol><p>Example:</p><p>Configure engine startup parameters:</p><pre><code class="language-properties">   wds.linkis.client.param.conf.spark.executor.instances=3\n   wds.linkis.client.param.conf.wds.linkis.yarnqueue=q02\n</code></pre><p>Configure labelMap parameters:</p><pre><code class="language-properties">   wds.linkis.client.label.myLabel=label123\n</code></pre><h4>Six, output result set to file</h4><p>Use the <code>-outPath</code> parameter to specify an output directory, linkis-cli will output the result set to a file, and each result set will automatically create a file. The output format is as follows:</p><pre><code>    task-[taskId]-result-[idx].txt\n</code></pre><p>E.g:</p><pre><code>    task-906-result-1.txt\n    task-906-result-2.txt\n    task-906-result-3.txt\n</code></pre>',59)],s={setup:(d,{expose:a})=>(a({frontmatter:{}}),(d,a)=>(t(),e("div",r,n)))},l={class:"markdown-body"},p=[d('<h1>Linkis-Cli使用文档</h1><h2>介绍</h2><p>Linkis-Cli 是一个用于向Linkis提交任务的Shell命令行程序。</p><h2>基础案例</h2><p>您可以参照下面的例子简单地向Linkis提交任务</p><p>第一步，检查conf/目录下是否存在默认配置文件<code>linkis-cli.properties</code>，且包含以下配置：</p><pre><code class="language-properties">   wds.linkis.client.common.gatewayUrl=http://127.0.0.1:9001\n   wds.linkis.client.common.authStrategy=token\n   wds.linkis.client.common.tokenKey=Validation-Code\n   wds.linkis.client.common.tokenValue=BML-AUTH\n</code></pre><p>第二步，进入linkis安装目录，输入指令：</p><pre><code class="language-bash">    ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -code &quot;select count(*) from testdb.test;&quot;  -submitUser hadoop -proxyUser hadoop \n</code></pre><p>第三步，您会在控制台看到任务被提交到linkis并开始执行的信息。</p><p>linkis-cli目前仅支持同步提交，即向linkis提交任务后，不断询问任务状态、拉取任务日志，直至任务结束。任务结束时状态如果为成功，linkis-cli还会主动拉取结果集并输出。</p><h2>使用方式</h2><pre><code class="language-bash">   ./bin/linkis-client [参数] [cli参数]\n</code></pre><h2>支持的参数列表</h2><ul><li><p>cli参数</p><table><thead><tr><th>参数</th><th>说明</th><th>数据类型</th><th>是否必填</th></tr></thead><tbody><tr><td>–gwUrl</td><td>手动指定linkis gateway地址</td><td>String</td><td>否</td></tr><tr><td>–authStg</td><td>指定认证策略</td><td>String</td><td>否</td></tr><tr><td>–authKey</td><td>指定认证key</td><td>String</td><td>否</td></tr><tr><td>–authVal</td><td>指定认证value</td><td>String</td><td>否</td></tr><tr><td>–userConf</td><td>指定配置文件位置</td><td>String</td><td>否</td></tr></tbody></table></li><li><p>参数</p><table><thead><tr><th>参数</th><th>说明</th><th>数据类型</th><th>是否必填</th></tr></thead><tbody><tr><td>-engType</td><td>引擎类型</td><td>String</td><td>是</td></tr><tr><td>-runType</td><td>执行类型</td><td>String</td><td>是</td></tr><tr><td>-code</td><td>执行代码</td><td>String</td><td>否</td></tr><tr><td>-codePath</td><td>本地执行代码文件路径</td><td>String</td><td>否</td></tr><tr><td>-smtUsr</td><td>指定提交用户</td><td>String</td><td>否</td></tr><tr><td>-pxyUsr</td><td>指定执行用户</td><td>String</td><td>否</td></tr><tr><td>-creator</td><td>指定creator</td><td>String</td><td>否</td></tr><tr><td>-scriptPath</td><td>scriptPath</td><td>String</td><td>否</td></tr><tr><td>-outPath</td><td>输出结果集到文件的路径</td><td>String</td><td>否</td></tr><tr><td>-confMap</td><td>configuration map</td><td>Map</td><td>否</td></tr><tr><td>-varMap</td><td>变量替换的variable map</td><td>Map</td><td>否</td></tr><tr><td>-labelMap</td><td>linkis labelMap</td><td>Map</td><td>否</td></tr><tr><td>-sourceMap</td><td>指定linkis sourceMap</td><td>Map</td><td>否</td></tr></tbody></table></li></ul><h2>详细示例</h2><h4>一、添加cli参数</h4><p>Cli参数可以通过手动指定的方式传入，此方式下会覆盖默认配置文件中的冲突配置项</p><pre><code class="language-bash">    ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -code &quot;select count(*) from testdb.test;&quot;  -submitUser hadoop -proxyUser hadoop  --gwUrl http://127.0.0.1:9001  --authStg token --authKey [tokenKey] --authVal [tokenValue] \n</code></pre><h4>二、添加引擎初始参数</h4><p>引擎的初始参数可以通过<code>-confMap</code>参数添加，注意参数的数据类型是Map，命令行的输入格式如下：</p><pre><code>    -confMap key1=val1,key2=val2,...\n</code></pre><p>例如：以下示例设置了引擎启动的yarn队列、spark executor个数等启动参数：</p><pre><code class="language-bash">   ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -confMap wds.linkis.yarnqueue=q02,spark.executor.instances=3 -code &quot;select count(*) from testdb.test;&quot;  -submitUser hadoop -proxyUser hadoop  \n</code></pre><p>当然，这些参数也支持以配置文件的方式读取，我们稍后会讲到</p><h4>三、添加标签</h4><p>标签可以通过<code>-labelMap</code>参数添加，与<code>-confMap</code>一样，<code>-labelMap</code>参数的类型也是Map:</p><pre><code class="language-bash">   /bin/linkis-client -engineType spark-2.4.3 -codeType sql -labelMap labelKey=labelVal -code &quot;select count(*) from testdb.test;&quot;  -submitUser hadoop -proxyUser hadoop  \n</code></pre><h4>四、变量替换</h4><p>Linkis-cli的变量替换通过<code>${}</code>符号和<code>-varMap</code>共同实现</p><pre><code class="language-bash">   ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -code &quot;select count(*) from \\${key};&quot; -varMap key=testdb.test  -submitUser hadoop -proxyUser hadoop  \n</code></pre><p>执行过程中sql语句会被替换为：</p><pre><code class="language-mysql-sql">   select count(*) from testdb.test\n</code></pre><p>注意<code>&#39;\\$&#39;</code>中的转义符是为了防止参数被linux提前解析，如果是<code>-codePath</code>指定本地脚本方式，则不需要转义符</p><h4>五、使用用户配置</h4><ol><li>linkis-cli支持加载用户自定义配置文件，配置文件路径通过<code>--userConf</code>参数指定，配置文件需要是<code>.properties</code>文件格式</li></ol><pre><code class="language-bash">   ./bin/linkis-client -engineType spark-2.4.3 -codeType sql -code &quot;select count(*) from testdb.test;&quot;  -submitUser hadoop -proxyUser hadoop  --userConf [配置文件路径]\n</code></pre><ol start="2"><li>哪些参数可以配置？</li></ol><p>所有参数都可以配置化，例如：</p><p>cli参数：</p><pre><code class="language-properties">   wds.linkis.client.common.gatewayUrl=http://127.0.0.1:9001\n   wds.linkis.client.common.authStrategy=static\n   wds.linkis.client.common.tokenKey=[静态认证key]\n   wds.linkis.client.common.tokenValue=[静态认证value]\n</code></pre><p>参数：</p><pre><code class="language-properties">   wds.linkis.client.label.engineType=spark-2.4.3\n   wds.linkis.client.label.codeType=sql\n</code></pre><p>Map类参数配置化时，key的格式为</p><pre><code>    [Map前缀] + [key]\n</code></pre><p>Map前缀包括：</p><ul><li>executionMap前缀: wds.linkis.client.exec</li><li>sourceMap前缀: wds.linkis.client.source</li><li>configurationMap前缀: wds.linkis.client.param.conf</li><li>runtimeMap前缀: wds.linkis.client.param.runtime</li><li>labelMap前缀: wds.linkis.client.label</li></ul><p>注意：</p><ol><li><p>variableMap不支持配置化</p></li><li><p>当配置的key和指令参数中已输入的key存在冲突时，优先级如下：</p><pre><code> 指令参数 &gt; 指令Map类型参数中的key &gt; 用户配置 &gt; 默认配置\n</code></pre></li></ol><p>示例：</p><p>配置引擎启动参数：</p><pre><code class="language-properties">   wds.linkis.client.param.conf.spark.executor.instances=3\n   wds.linkis.client.param.conf.wds.linkis.yarnqueue=q02\n</code></pre><p>配置labelMap参数：</p><pre><code class="language-properties">   wds.linkis.client.label.myLabel=label123\n</code></pre><h4>六、输出结果集到文件</h4><p>使用<code>-outPath</code>参数指定一个输出目录，linkis-cli会将结果集输出到文件，每个结果集会自动创建一个文件，输出形式如下：</p><pre><code>    task-[taskId]-result-[idx].txt\n</code></pre><p>例如：</p><pre><code>    task-906-result-1.txt\n    task-906-result-2.txt\n    task-906-result-3.txt\n</code></pre>',59)],c={setup:(d,{expose:a})=>(a({frontmatter:{}}),(d,a)=>(t(),e("div",l,p)))},u={setup(e){const d=a(localStorage.getItem("locale")||"en");return(e,a)=>"en"===d.value?(t(),i(o(s),{key:0})):(t(),i(o(c),{key:1}))}};export{u as default};
