//@auth
//@req(baseUrl, cronTime, dbuser, dbpass)
var reponame = getParam("reponame");
var defaultScriptName = "${env.envName}-wp-backup-" + reponame;
var scriptName = getParam("scriptName", defaultScriptName);
var envName = getParam("envName", "${env.envName}");
var envAppid = getParam("envAppid", "${env.appid}");
var userId = getparam("userId", "");
var backupCount = getParam("backupCount", "5");
var storageNodeId = getParam("storageNodeId");
var backupExecNode = getParam("backupExecNode");
var storageEnv = getParam("storageEnv");
var nodeGroup = getParam("nodeGroup");
var dbuser = getParam("dbuser");
var dbpass = getParam("dbpass");
var dbname = getParam("dbname");
var repopass = getParam("repopass");

function run() {
    var BackupManager = use("scripts/backup-manager.js", {
        session: session,
        baseUrl: baseUrl,
        uid: userId,
        cronTime: cronTime,
        scriptName: scriptName,
        envName: envName,
        envAppid: envAppid,
        storageNodeId: storageNodeId,
        backupExecNode: backupExecNode,
        nodeGroup: nodeGroup,
        storageEnv: storageEnv,
        backupCount: backupCount,
        dbuser: dbuser,
        dbpass: dbpass,
        dbname: dbname,
        reponame: reponame,
        repopass: repopass,
    });

    jelastic.local.ReturnResult(
        BackupManager.install()
    );
}

function use(script, config) {
    var Transport = com.hivext.api.core.utils.Transport,
        url = baseUrl + "/" + script + "?_r=" + Math.random(),
        body = new Transport().get(url);
    return new (new Function("return " + body)())(config);
}

try {
    run();
} catch (ex) {
    var resp = {
        result: com.hivext.api.Response.ERROR_UNKNOWN,
        error: "Error: " + toJSON(ex)
    };

    jelastic.marketplace.console.WriteLog("ERROR: " + resp);
    jelastic.local.ReturnResult(resp);
}
