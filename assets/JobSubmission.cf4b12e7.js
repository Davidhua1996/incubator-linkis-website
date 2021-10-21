import{o as e,c as n,b as t,e as i,r as a,l,u as s}from"./vendor.12a5b039.js";var o="/assets/submission.22e30fbd.png",r="/assets/orchestrate.b395b673.png",c="/assets/physical_tree.6d05f37c.png",u="/assets/result_acquisition.ccd9e593.png";const h={class:"markdown-body"},p=[t("h1",null,"Job submission, preparation and execution process",-1),t("p",null,"The submission and execution of computing tasks (Job) is the core capability provided by Linkis. It almost colludes with all modules in the Linkis computing governance architecture and occupies a core position in Linkis.",-1),t("p",null,"The whole process, starting at submitting user’s computing tasks from the client and ending with returning final results, is divided into three stages: submission -> preparation -> executing. The details are shown in the following figure.",-1),t("p",null,[t("img",{src:"/assets/overall.d0b560e6.png",alt:"The overall flow chart of computing tasks"})],-1),t("p",null,"Among them:",-1),t("ul",null,[t("li",null,[t("p",null,"Entrance, as the entrance to the submission stage, provides task reception, scheduling and job information forwarding capabilities. It is the unified entrance for all computing tasks. It will forward computing tasks to Orchestrator for scheduling and execution.")]),t("li",null,[t("p",null,"Orchestrator, as the entrance to the preparation phase, mainly provides job analysis, orchestration and execution capabilities.")]),t("li",null,[t("p",null,"Linkis Manager: The management center of computing governance capabilities. Its main responsibilities are as follow:"),t("ol",null,[t("li",null,"ResourceManager：Not only has the resource management capabilities of Yarn and Linkis EngineConnManager, but also provides tag-based multi-level resource allocation and recovery capabilities, allowing ResourceManager to have full resource management capabilities across clusters and across computing resource types；"),t("li",null,"AppManager: Coordinate and manage all EngineConnManager and EngineConn, including the life cycle of EngineConn application, reuse, creation, switching, and destruction to AppManager for management;"),t("li",null,"LabelManager: Based on multi-level combined labels, it will provide label support for the routing and management capabilities of EngineConn and EngineConnManager across IDC and across clusters;"),t("li",null,"EngineConnPluginServer: Externally provides the resource generation capabilities required to start an EngineConn and EngineConn startup command generation capabilities.")])]),t("li",null,[t("p",null,"EngineConnManager: It is the manager of EngineConn, which provides engine life-cycle management, and at the same time reports load information and its own health status to RM.")]),t("li",null,[t("p",null,"EngineConn: It is the actual connector between Linkis and the underlying computing storage engines. All user computing and storage tasks will eventually be submitted to the underlying computing storage engine by EngineConn. According to different user scenarios, EngineConn provides full-stack computing capability framework support for interactive computing, streaming computing, off-line computing, and data storage tasks.")])],-1),t("h2",null,"1. Submission Stage",-1),t("p",null,"The submission phase is mainly the interaction of Client -> Linkis Gateway -> Entrance, and the process is as follows:",-1),t("p",null,[t("img",{src:o,alt:"Flow chart of submission phase"})],-1),t("ol",null,[t("li",null,[i("First, the Client (such as the front end or the client) initiates a Job request, and the job request information is simplified as follows (for the specific usage of Linkis, please refer to "),t("a",{href:"#/docs/manual/HowToUse"},"How to use Linkis"),i("):")])],-1),t("pre",null,[t("code",null,"POST /api/rest_j/v1/entrance/submit\n")],-1),t("pre",null,[t("code",{class:"language-json"},'{\n    "executionContent": {"code": "show tables", "runType": "sql"},\n    "params": {"variable": {}, "configuration": {}},  //非必须\n    "source": {"scriptPath": "file:///1.hql"}, //非必须，仅用于记录代码来源\n    "labels": {\n        "engineType": "spark-2.4.3",  //指定引擎\n        "userCreator": "johnnwnag-IDE"  // 指定提交用户和提交系统\n    }\n}\n')],-1),t("ol",{start:"2"},[t("li",null,[i("After Linkis-Gateway receives the request, according to the serviceName in the URI "),t("code",null,"/api/rest_j/v1/${serviceName}/.+"),i(", it will confirm the microservice name for routing and forwarding. Here Linkis-Gateway will parse out the name as entrance and Job is forwarded to the Entrance microservice. It should be noted that if the user specifies a routing label, the Entrance microservice instance with the corresponding label will be selected for forwarding according to the routing label instead of random forwarding.")]),t("li",null,"After Entrance receives the Job request, it will first simply verify the legitimacy of the request, then use RPC to call JobHistory to persist the job information, and then encapsulate the Job request as a computing task, put it in the scheduling queue, and wait for it to be consumed by consumption thread."),t("li",null,"The scheduling queue will open up a consumption queue and a consumption thread for each group. The consumption queue is used to store the user computing tasks that have been preliminarily encapsulated. The consumption thread will continue to take computing tasks from the consumption queue for consumption in a FIFO manner. The current default grouping method is Creator + User (that is, submission system + user). Therefore, even if it is the same user, as long as it is a computing task submitted by different systems, the actual consumption queues and consumption threads are completely different, and they are completely isolated from each other. (Reminder: Users can modify the grouping algorithm as needed)"),t("li",null,"After the consuming thread takes out the calculation task, it will submit the calculation task to Orchestrator, which officially enters the preparation phase.")],-1),t("h2",null,"2. Preparation Stage",-1),t("p",null,"There are two main processes in the preparation phase. One is to apply for an available EngineConn from LinkisManager to submit and execute the following computing tasks. The other is Orchestrator to orchestrate the computing tasks submitted by Entrance, and to convert a user’s computing request into a physical execution tree and handed over to the execution phase where a computing task actually being executed.",-1),t("h4",null,"2.1 Apply to LinkisManager for available EngineConn",-1),t("p",null,"If the user has a reusable EngineConn in LinkisManager, the EngineConn is directly locked and returned to Orchestrator, and the entire application process ends.",-1),t("p",null,"How to define a reusable EngineConn? It refers to those that can match all the label requirements of the computing task, and the EngineConn’s own health status is Healthy (the load is low and the actual status is Idle). Then, all the EngineConn that meets the conditions are sorted and selected according to the rules, and finally the best one is locked.",-1),t("p",null,[i("If the user does not have a reusable EngineConn, a process to request a new EngineConn will be triggered at this time. Regarding the process, please refer to: "),t("a",{href:"/#/docs/architecture/AddEngineConn"},"How to add an EngineConn"),i(".")],-1),t("h4",null,"2.2 Orchestrate a computing task",-1),t("p",null,"Orchestrator is mainly responsible for arranging a computing task (JobReq) into a physical execution tree (PhysicalTree) that can be actually executed, and providing the execution capabilities of the Physical tree.",-1),t("p",null,"Here we first focus on Orchestrator’s computing task scheduling capabilities. A flow chart is shown below:",-1),t("p",null,[t("img",{src:r,alt:"Orchestration flow chart"})],-1),t("p",null,"The main process is as follows:",-1),t("ul",null,[t("li",null,"Converter: Complete the conversion of the JobReq (task request) submitted by the user to Orchestrator’s ASTJob. This step will perform parameter check and information supplementation on the calculation task submitted by the user, such as variable replacement, etc."),t("li",null,"Parser: Complete the analysis of ASTJob. Split ASTJob into an AST tree composed of ASTJob and ASTStage."),t("li",null,"Validator: Complete the inspection and information supplement of ASTJob and ASTStage, such as code inspection, necessary Label information supplement, etc."),t("li",null,"Planner: Convert an AST tree into a Logical tree. The Logical tree at this time has been composed of LogicalTask, which contains all the execution logic of the entire computing task."),t("li",null,"Optimizer: Convert a Logical tree to a Physica tree and optimize the Physical tree.")],-1),t("p",null,"In a physical tree, the majority of nodes are computing strategy logic. Only the middle ExecTask truly encapsulates the execution logic which will be further submitted to and executed at EngineConn. As shown below:",-1),t("p",null,[t("img",{src:c,alt:"Physical Tree"})],-1),t("p",null,"Different computing strategies have different execution logics encapsulated by JobExecTask and StageExecTask in the Physical tree.",-1),t("p",null,"The execution logic encapsulated by JobExecTask and StageExecTask in the Physical tree depends on the specific type of computing strategy.",-1),t("p",null,"For example, under the multi-active computing strategy, for a computing task submitted by a user, the execution logic submitted to EngineConn of different clusters for execution is encapsulated in two ExecTasks, and the related strategy logic is reflected in the parent node (StageExecTask(End)) of the two ExecTasks.",-1),t("p",null,"Here, we take the multi-reading scenario under the multi-active computing strategy as an example.",-1),t("p",null,"In multi-reading scenario, only one result of ExecTask is required to return. Once the result is returned , the Physical tree can be marked as successful. However, the Physical tree only has the ability to execute sequentially according to dependencies, and cannot terminate the execution of each node. Once a node is canceled or fails to execute, the entire Physical tree will be marked as failure. At this time, StageExecTask (End) is needed to ensure that the Physical tree can not only cancel the ExecTask that failed to execute, but also continue to upload the result set generated by the Successful ExecTask, and let the Physical tree continue to execute. This is the execution logic of computing strategy represented by StageExecTask.",-1),t("p",null,"The orchestration process of Linkis Orchestrator is similar to many SQL parsing engines (such as Spark, Hive’s SQL parser). But in fact, the orchestration capability of Linkis Orchestrator is realized based on the computing governance field for the different computing governance needs of users. The SQL parsing engine is a parsing orchestration oriented to the SQL language. Here is a simple distinction:",-1),t("ol",null,[t("li",null,"What Linkis Orchestrator mainly wants to solve is the orchestration requirements caused by different computing tasks for computing strategies. For example, in order to be multi-active, Orchestrator will submit a calculation task for the user, based on the “multi-active” computing strategy requirements, compile a physical tree, so as to submit to multiple clusters to perform this calculation task. And in the process of constructing the entire Physical tree, various possible abnormal scenarios have been fully considered, and they have all been reflected in the Physical tree."),t("li",null,"The orchestration ability of Linkis Orchestrator has nothing to do with the programming language. In theory, as long as an engine has adapted to Linkis, all the programming languages it supports can be orchestrated, while the SQL parsing engine only cares about the analysis and execution of SQL, and is only responsible for parsing a piece of SQL into one executable Physical tree, and finally calculate the result."),t("li",null,"Linkis Orchestrator also has the ability to parse SQL, but SQL parsing is just one of Orchestrator Parser’s analytic implementations for the SQL programming language. The Parser of Linkis Orchestrator also considers introducing Apache Calcite to parse SQL. It supports splitting a user SQL that spans multiple computing engines (must be a computing engine that Linkis has docked) into multiple sub SQLs and submitting them to each corresponding engine during the execution phase. Finally, a suitable calculation engine is selected for summary calculation.")],-1),t("p",null,[i("Please refer to "),t("a",{href:"https://github.com/WeBankFinTech/Linkis-Doc/blob/master/en_US/Architecture_Documents/Orchestrator/Orchestrator_architecture_doc.md"},"Orchestrator Architecture Design"),i(" for more details.")],-1),t("p",null,"After the analysis and arrangement of Linkis Orchestrator, the computing task has been transformed into a executable physical tree. Orchestrator will submit the Physical tree to Orchestrator’s Execution module and enter the final execution stage.",-1),t("h2",null,"3. Execution Stage",-1),t("p",null,"The execution stage is mainly divided into the following two steps, these two steps are the last two phases of capabilities provided by Linkis Orchestrator:",-1),t("p",null,[t("img",{src:"/assets/execution.2d8c96b7.png",alt:"Flow chart of the execution stage"})],-1),t("p",null,"The main process is as follows:",-1),t("ul",null,[t("li",null,"Execution: Analyze the dependencies of the Physical tree, and execute them sequentially from the leaf nodes according to the dependencies."),t("li",null,"Reheater: Once the execution of a node in the Physical tree is completed, it will trigger a reheat. Reheating allows the physical tree to be dynamically adjusted according to the real-time execution.For example: it is detected that a leaf node fails to execute, and it supports retry (if it is caused by throwing ReTryExecption), the Physical tree will be automatically adjusted, and a retry parent node with exactly the same content is added to the leaf node .")],-1),t("p",null,"Let us go back to the Execution stage, where we focus on the execution logic of the ExecTask node that encapsulates the user computing task submitted to EngineConn.",-1),t("ol",null,[t("li",null,"As mentioned earlier, the first step in the preparation phase is to obtain a usable EngineConn from LinkisManager. After ExecTask gets this EngineConn, it will submit the user’s computing task to EngineConn through an RPC request."),t("li",null,"After EngineConn receives the computing task, it will asynchronously submit it to the underlying computing storage engine through the thread pool, and then immediately return an execution ID."),t("li",null,"After ExecTask gets this execution ID, it can then use the this ID to asynchronously pull the execution status of the computing task (such as: status, progress, log, result set, etc.)."),t("li",null,"At the same time, EngineConn will monitor the execution of the underlying computing storage engine in real time through multiple registered Listeners. If the computing storage engine does not support registering Listeners, EngineConn will start a daemon thread for the computing task and periodically pull the execution status from the computing storage engine."),t("li",null,"EngineConn will pull the execution status back to the microservice where Orchestrator is located in real time through RCP request."),t("li",null,"After the Receiver of the microservice receives the execution status, it will broadcast it through the ListenerBus, and the Orchestrator Execution will consume the event and dynamically update the execution status of the Physical tree."),t("li",null,"The result set generated by the calculation task will be written to storage media such as HDFS at the EngineConn side. EngineConn returns only the result set path through RPC, Execution consumes the event, and broadcasts the obtained result set path through ListenerBus, so that the Listener registered by Entrance with Orchestrator can consume the result set path and write the result set path Persist to JobHistory."),t("li",null,"After the execution of the computing task on the EngineConn side is completed, through the same logic, the Execution will be triggered to update the state of the ExecTask node of the Physical tree, so that the Physical tree will continue to execute until the entire tree is completely executed. At this time, Execution will broadcast the completion status of the calculation task through ListenerBus."),t("li",null,"After the Entrance registered Listener with the Orchestrator consumes the state event, it updates the job state to JobHistory, and the entire task execution is completed.")],-1),t("hr",null,null,-1),t("p",null,"Finally, let’s take a look at how the client side knows the state of the calculation task and obtains the calculation result in time, as shown in the following figure:",-1),t("p",null,[t("img",{src:u,alt:"Results acquisition process"})],-1),t("p",null,"The specific process is as follows:",-1),t("ol",null,[t("li",null,"The client periodically polls to request Entrance to obtain the status of the computing task."),t("li",null,"Once the status is flipped to success, it sends a request for job information to JobHistory, and gets all the result set paths."),t("li",null,"Initiate a query file content request to PublicService through the result set path, and obtain the content of the result set.")],-1),t("p",null,"Since then, the entire process of job submission -> preparation -> execution have been completed.",-1)],g={setup:(t,{expose:i})=>(i({frontmatter:{}}),(t,i)=>(e(),n("div",h,p)))},d={class:"markdown-body"},m=[t("h1",null,"JobSubmission",-1),t("p",null,"计算任务（Job）的提交执行是Linkis提供的核心能力，它几乎串通了Linkis计算治理架构中的所有模块，在Linkis之中占据核心地位。",-1),t("p",null,"我们将用户的计算任务从客户端提交开始，到最后的返回结果为止，整个流程分为三个阶段：提交 -> 准备 -> 执行，如下图所示：",-1),t("p",null,[t("img",{src:"/assets/overall.d0b560e6.png",alt:"计算任务整体流程图"})],-1),t("p",null,"其中：",-1),t("ul",null,[t("li",null,[t("p",null,"Entrance作为提交阶段的入口，提供任务的接收、调度和Job信息的转发能力，是所有计算型任务的统一入口，它将把计算任务转发给Orchestrator进行编排和执行；")]),t("li",null,[t("p",null,"Orchestrator作为准备阶段的入口，主要提供了Job的解析、编排和执行能力。。")]),t("li",null,[t("p",null,"Linkis Manager：是计算治理能力的管理中枢，主要的职责为："),t("ol",null,[t("li",null,[t("p",null,"ResourceManager：不仅具备对Yarn和Linkis EngineConnManager的资源管理能力，还将提供基于标签的多级资源分配和回收能力，让ResourceManager具备跨集群、跨计算资源类型的全资源管理能力；")]),t("li",null,[t("p",null,"AppManager：统筹管理所有的EngineConnManager和EngineConn，包括EngineConn的申请、复用、创建、切换、销毁等生命周期全交予AppManager进行管理；")]),t("li",null,[t("p",null,"LabelManager：将基于多级组合标签，为跨IDC、跨集群的EngineConn和EngineConnManager路由和管控能力提供标签支持；")]),t("li",null,[t("p",null,"EngineConnPluginServer：对外提供启动一个EngineConn的所需资源生成能力和EngineConn的启动命令生成能力。")])])]),t("li",null,[t("p",null,"EngineConnManager：是EngineConn的管理器，提供引擎的生命周期管理，同时向RM汇报负载信息和自身的健康状况。")]),t("li",null,[t("p",null,"EngineConn：是Linkis与底层计算存储引擎的实际连接器，用户所有的计算存储任务最终都会交由EngineConn提交给底层计算存储引擎。根据用户的不同使用场景，EngineConn提供了交互式计算、流式计算、离线计算、数据存储任务的全栈计算能力框架支持。")])],-1),t("p",null,"接下来，我们将详细介绍计算任务从 提交 -> 准备 -> 执行 的三个阶段。",-1),t("h2",null,"一、提交阶段",-1),t("p",null,"提交阶段主要是Client端 -> Linkis Gateway -> Entrance的交互，其流程如下：",-1),t("p",null,[t("img",{src:o,alt:"提交阶段流程图"})],-1),t("ol",null,[t("li",null,[i("首先，Client（如前端或客户端）发起Job请求，Job请求信息精简如下（关于Linkis的具体使用方式，请参考 "),t("a",{href:"/#/docs/manual/HowToUse"},"如何使用Linkis"),i("）：")])],-1),t("pre",null,[t("code",null,"POST /api/rest_j/v1/entrance/submit\n")],-1),t("pre",null,[t("code",{class:"language-json"},'{\n    "executionContent": {"code": "show tables", "runType": "sql"},\n    "params": {"variable": {}, "configuration": {}},  //非必须\n    "source": {"scriptPath": "file:///1.hql"}, //非必须，仅用于记录代码来源\n    "labels": {\n        "engineType": "spark-2.4.3",  //指定引擎\n        "userCreator": "johnnwnag-IDE"  // 指定提交用户和提交系统\n    }\n}\n')],-1),t("ol",{start:"2"},[t("li",null,[t("p",null,[i("Linkis-Gateway接收到请求后，根据URI "),t("code",null,"/api/rest_j/v1/${serviceName}/.+"),i("中的serviceName，确认路由转发的微服务名，这里Linkis-Gateway会解析出微服务名为entrance，将Job请求转发给Entrance微服务。需要说明的是：如果用户指定了路由标签，则在转发时，会根据路由标签选择打了相应标签的Entrance微服务实例进行转发，而不是随机转发。")])]),t("li",null,[t("p",null,"Entrance接收到Job请求后，会先简单校验请求的合法性，然后通过RPC调用JobHistory对Job的信息进行持久化，然后将Job请求封装为一个计算任务，放入到调度队列之中，等待被消费线程消费。")]),t("li",null,[t("p",null,"调度队列会为每个组开辟一个消费队列 和 一个消费线程，消费队列用于存放已经初步封装的用户计算任务，消费线程则按照FIFO的方式，不断从消费队列中取出计算任务进行消费。目前默认的分组方式为 Creator + User（即提交系统 + 用户），因此，即便是同一个用户，只要是不同的系统提交的计算任务，其实际的消费队列和消费线程都完全不同，完全隔离互不影响。（温馨提示：用户可以按需修改分组算法）")]),t("li",null,[t("p",null,"消费线程取出计算任务后，会将计算任务提交给Orchestrator，由此正式进入准备阶段。")])],-1),t("h2",null,"二、 准备阶段",-1),t("p",null,"准备阶段主要有两个流程，一是向LinkisManager申请一个可用的EngineConn，用于接下来的计算任务提交执行，二是Orchestrator对Entrance提交过来的计算任务进行编排，将一个用户计算请求，通过编排转换成一个物理执行树，然后交给第三阶段的执行阶段去真正提交执行。",-1),t("h4",null,"2.1 向LinkisManager申请可用EngineConn",-1),t("p",null,"如果在LinkisManager中，该用户存在可复用的EngineConn，则直接锁定该EngineConn，并返回给Orchestrator，整个申请流程结束。",-1),t("p",null,"如何定义可复用EngineConn？指能匹配计算任务的所有标签要求的，且EngineConn本身健康状态为Healthy（负载低且实际EngineConn状态为Idle）的，然后再按规则对所有满足条件的EngineConn进行排序选择，最终锁定一个最佳的EngineConn。",-1),t("p",null,[i("如果该用户不存在可复用的EngineConn，则此时会触发EngineConn新增流程，关于EngineConn新增流程，请参数："),t("a",{href:"#/docs/architecture/AddEngineConn"},"EngineConn新增流程"),i(" 。")],-1),t("h4",null,"2.2 计算任务编排",-1),t("p",null,"Orchestrator主要负责将一个计算任务（JobReq），编排成一棵可以真正执行的物理执行树（PhysicalTree），并提供Physical树的执行能力。",-1),t("p",null,"这里先重点介绍Orchestrator的计算任务编排能力，如下图：",-1),t("p",null,[t("img",{src:r,alt:"编排流程图"})],-1),t("p",null,"其主要流程如下：",-1),t("ul",null,[t("li",null,[t("p",null,"Converter（转换）：完成对用户提交的JobReq（任务请求）转换为Orchestrator的ASTJob，该步骤会对用户提交的计算任务进行参数检查和信息补充，如变量替换等；")]),t("li",null,[t("p",null,"Parser（解析）：完成对ASTJob的解析，将ASTJob拆成由ASTJob和ASTStage组成的一棵AST树。")]),t("li",null,[t("p",null,"Validator（校验）： 完成对ASTJob和ASTStage的检验和信息补充，如代码检查、必须的Label信息补充等。")]),t("li",null,[t("p",null,"Planner（计划）：将一棵AST树转换为一棵Logical树。此时的Logical树已经由LogicalTask组成，包含了整个计算任务的所有执行逻辑。")]),t("li",null,[t("p",null,"Optimizer(优化阶段)：将一棵Logical树转换为Physica树，并对Physical树进行优化。")])],-1),t("p",null,"一棵Physical树，其中的很多节点都是计算策略逻辑，只有中间的ExecTask，才真正封装了将用户计算任务提交给EngineConn进行提交执行的执行逻辑。如下图所示：",-1),t("p",null,[t("img",{src:c,alt:"Physical树"})],-1),t("p",null,"不同的计算策略，其Physical树中的JobExecTask 和 StageExecTask所封装的执行逻辑各不相同。",-1),t("p",null,"如多活计算策略下，用户提交的一个计算任务，其提交给不同集群的EngineConn进行执行的执行逻辑封装在了两个ExecTask中，而相关的多活策略逻辑则体现在了两个ExecTask的父节点StageExecTask（End）之中。",-1),t("p",null,"这里举多活计算策略下的多读场景。",-1),t("p",null,"多读时，实际只要求一个ExecTask返回结果，该Physical树就可以标记为执行成功并返回结果了，但Physical树只具备按依赖关系进行依次执行的能力，无法终止某个节点的执行，且一旦某个节点被取消执行或执行失败，则整个Physical树其实会被标记为执行失败，这时就需要StageExecTask（End）来做一些特殊的处理，来保证既可以取消另一个ExecTask，又能把执行成功的ExecTask所产生的结果集继续往上传，让Physical树继续往上执行。这就是StageExecTask所代表的计算策略执行逻辑。",-1),t("p",null,"Linkis Orchestrator的编排流程与很多SQL解析引擎（如Spark、Hive的SQL解析器）存在相似的地方，但实际上，Linkis Orchestrator是面向计算治理领域针对用户不同的计算治理需求，而实现的解析编排能力，而SQL解析引擎是面向SQL语言的解析编排。这里做一下简单区分：",-1),t("ol",null,[t("li",null,[t("p",null,"Linkis Orchestrator主要想解决的，是不同计算任务对计算策略所引发出的编排需求。如：用户想具备多活的能力，则Orchestrator会为用户提交的一个计算任务，基于“多活”的计算策略需求，编排出一棵Physical树，从而做到往多个集群去提交执行这个计算任务，并且在构建整个Physical树的过程中，已经充分考虑了各种可能存在的异常场景，并都已经体现在了Physical树中。")]),t("li",null,[t("p",null,"Linkis Orchestrator的编排能力与编程语言无关，理论上只要是Linkis已经对接的引擎，其支持的所有编程语言都支持编排；而SQL解析引擎只关心SQL的解析和执行，只负责将一条SQL解析成一颗可执行的Physical树，最终计算出结果。")]),t("li",null,[t("p",null,"Linkis Orchestrator也具备对SQL的解析能力，但SQL解析只是Orchestrator Parser针对SQL这种编程语言的其中一种解析实现。Linkis Orchestrator的Parser也考虑引入Apache Calcite对SQL进行解析，支持将一条跨多个计算引擎（必须是Linkis已经对接的计算引擎）的用户SQL，拆分成多条子SQL，在执行阶段时分别提交给对应的计算引擎进行执行，最后选择一个合适的计算引擎进行汇总计算。")])],-1),t("p",null,[i("关于Orchestrator的编排详细介绍，请参考："),t("a",{href:"https://github.com/WeBankFinTech/Linkis-Doc/blob/master/zh_CN/Architecture_Documents/Orchestrator/Orchestrator_architecture_doc.md"},"Orchestrator架构设计")],-1),t("p",null,"经过了Linkis Orchestrator的解析编排后，用户的计算任务已经转换成了一颗可被执行的Physical树。Orchestrator会将该Physical树提交给Orchestrator的Execution模块，进入最后的执行阶段。",-1),t("h2",null,"三、执行阶段",-1),t("p",null,"执行阶段主要分为如下两步，这两步是Linkis Orchestrator提供的最后两阶段的能力：",-1),t("p",null,[t("img",{src:"/assets/execution.2d8c96b7.png",alt:"执行阶段流程图"})],-1),t("p",null,"其主要流程如下：",-1),t("ul",null,[t("li",null,[t("p",null,"Execution（执行）：解析Physical树的依赖关系，按照依赖从叶子节点开始依次执行。")]),t("li",null,[t("p",null,"Reheater（再热）：一旦Physical树有节点执行完成，都会触发一次再热。再热允许依照Physical树的实时执行情况，动态调整Physical树，继续进行执行。如：检测到某个叶子节点执行失败，且该叶子节点支持重试（如失败原因是抛出了ReTryExecption），则自动调整Physical树，在该叶子节点上面添加一个内容完全相同的重试父节点。")])],-1),t("p",null,"我们回到Execution阶段，这里重点介绍封装了将用户计算任务提交给EngineConn的ExecTask节点的执行逻辑。",-1),t("ol",null,[t("li",null,[t("p",null,"前面有提到，准备阶段的第一步，就是向LinkisManager获取一个可用的EngineConn，ExecTask拿到这个EngineConn后，会通过RPC请求，将用户的计算任务提交给EngineConn。")]),t("li",null,[t("p",null,"EngineConn接收到计算任务之后，会通过线程池异步提交给底层的计算存储引擎，然后马上返回一个执行ID。")]),t("li",null,[t("p",null,"ExecTask拿到这个执行ID后，后续可以通过该执行ID异步去拉取计算任务的执行情况（如：状态、进度、日志、结果集等）。")]),t("li",null,[t("p",null,"同时，EngineConn会通过注册的多个Listener，实时监听底层计算存储引擎的执行情况。如果该计算存储引擎不支持注册Listener，则EngineConn会为计算任务启动守护线程，定时向计算存储引擎拉取执行情况。")]),t("li",null,[t("p",null,"EngineConn将拉取到的执行情况，通过RCP请求，实时传回Orchestrator所在的微服务。")]),t("li",null,[t("p",null,"该微服务的Receiver接收到执行情况后，会通过ListenerBus进行广播，Orchestrator的Execution消费该事件并动态更新Physical树的执行情况。")]),t("li",null,[t("p",null,"计算任务所产生的结果集，会在EngineConn端就写入到HDFS等存储介质之中。EngineConn通过RPC传回的只是结果集路径，Execution消费事件，并将获取到的结果集路径通过ListenerBus进行广播，使Entrance向Orchestrator注册的Listener能消费到该结果集路径，并将结果集路径写入持久化到JobHistory之中。")]),t("li",null,[t("p",null,"EngineConn端的计算任务执行完成后，通过同样的逻辑，会触发Execution更新Physical树该ExecTask节点的状态，使得Physical树继续往上执行，直到整棵树全部执行完成。这时Execution会通过ListenerBus广播计算任务执行完成的状态。")]),t("li",null,[t("p",null,"Entrance向Orchestrator注册的Listener消费到该状态事件后，向JobHistory更新Job的状态，整个任务执行完成。")])],-1),t("hr",null,null,-1),t("p",null,"最后，我们再来看下Client端是如何得知计算任务状态变化，并及时获取到计算结果的，具体如下图所示：",-1),t("p",null,[t("img",{src:u,alt:"结果获取流程"})],-1),t("p",null,"具体流程如下：",-1),t("ol",null,[t("li",null,[t("p",null,"Client端定时轮询请求Entrance，获取计算任务的状态。")]),t("li",null,[t("p",null,"一旦发现状态翻转为成功，则向JobHistory发送获取Job信息的请求，拿到所有的结果集路径")]),t("li",null,[t("p",null,"通过结果集路径向PublicService发起查询文件内容的请求，获取到结果集的内容。")])],-1),t("p",null,"自此，整个Job的提交 -> 准备 -> 执行 三个阶段全部完成。",-1)],f={setup:(t,{expose:i})=>(i({frontmatter:{}}),(t,i)=>(e(),n("div",d,m)))},b={setup(n){const t=a(localStorage.getItem("locale")||"en");return(n,i)=>"en"===t.value?(e(),l(s(g),{key:0})):(e(),l(s(f),{key:1}))}};export{b as default};
