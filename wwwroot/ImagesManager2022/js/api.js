const apiBaseURL = "http://localhost:5000/api/images";
const host = "http://localhost:5000";

function HEAD(successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL,
        type: 'HEAD',
        contentType: 'text/plain',
        complete: request => { successCallBack(request.getResponseHeader('ETag')) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function GET_ID(id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + id,
        headers : getBearerAuthorizationToken(),
        type: 'GET',
        success: data => { successCallBack(data); },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function GET_ALL(successCallBack, errorCallBack, queryString = null) {
    let url = apiBaseURL + (queryString ? queryString : "");
    $.ajax({
        url: url,
        headers : getBearerAuthorizationToken(),
        type: 'GET',
        success: (data, status, xhr) => { successCallBack(data, xhr.getResponseHeader("ETag")) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function POST(data, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL,
        headers : getBearerAuthorizationToken(),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (data) => { successCallBack(data) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function PUT(bookmark, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + bookmark.Id,
        headers : getBearerAuthorizationToken(),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(bookmark),
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function DELETE(id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + id,
        headers : getBearerAuthorizationToken(),
        type: 'DELETE',
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function StoreToken(tokenInfo){
    sessionStorage.setItem('token', tokenInfo.Access_token);

}

//les Méthodes suivantes pour rajouter, modifier, se connecter, se déconnecter et désinscrire un usager.
function POST_LOGIN(loginInfo, successCallBack, errorCallBack) {
    $.ajax({
        url: host + "/token",
        
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(loginInfo),
        success: (tokenInfo) => { 
            StoreToken(tokenInfo);
            GET_USER(tokenInfo.UserId, successCallBack, errorCallBack);
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function POST_USER(data, successCallBack, errorCallBack) {
    $.ajax({
        url: "http://localhost:5000/accounts/register",
        
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (data) => { successCallBack(data) }, //REVOIR QUELLE FONCTION ENVOYER.
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function MODIFY_USER(user, successCallBack, errorCallBack) {
    $.ajax({
        url: "http://localhost:5000/accounts/modify",
        headers : getBearerAuthorizationToken(),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(user),
        success: () => {
             GET_USER(user.Id, successCallBack, errorCallBack);
            },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function GET_USER(id, successCallBack, errorCallBack) {
    $.ajax({
        url: "http://localhost:5000/accounts/index" + "/" + id,
        
        type: 'GET',
        success: user => { 
            StoreUser(user);
            successCallBack(); 
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function StoreUser(user){
    sessionStorage.setItem('user', JSON.stringify(user));
}

function RetrieveUser(){
    return JSON.parse(sessionStorage.getItem('user'));
}

function GET_LOGOUT(userId, successCallBack, errorCallBack) {
    $.ajax({
        url: "http://localhost:5000/accounts/logout/" + userId,
        headers : getBearerAuthorizationToken(),
        type: 'GET',
        success: (data) => {successCallBack(data)},
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function GET_VERIFY(verifyInfo, errorCallBack) {
    $.ajax({
        url: "http://localhost:5000/accounts/verify?id="+verifyInfo.Id+"&code="+verifyInfo.code,
        headers : getBearerAuthorizationToken(),
        type: 'GET',
        success: (data) => {console.log(data)},
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function DELETE_USER(userIdToDelete, errorCallBack) {
    $.ajax({
        url: "http://localhost:5000/accounts/remove/"+userIdToDelete,
        headers : getBearerAuthorizationToken(),
        type: 'GET',
        success: (data) => {console.log(data)},
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

//#region access token.
function getBearerAuthorizationToken() {
    return { 'Authorization': 'Bearer ' + retrieveAccessToken() };
}

function retrieveAccessToken(){
    return sessionStorage.getItem("token");
}
//#endregion