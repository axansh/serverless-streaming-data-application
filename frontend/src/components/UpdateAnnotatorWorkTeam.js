
const AWS = require('aws-sdk')
AWS.config.loadFromPath('./awsConfig.json')

const sagemaker = new AWS.SageMaker()
const cognito = new AWS.CognitoIdentityServiceProvider()

main = async () => {
    const data = await getWorkTeamDetails('Annotations-Engg-Team-Only-Samples')
    const member = data.Workteam.MemberDefinitions[0]
    const users = await getUsersInGroup(
        member.CognitoMemberDefinition.UserGroup, member.CognitoMemberDefinition.UserPool)
    console.log(JSON.stringify(users))
    const response = await addUserToGroup(
        member.CognitoMemberDefinition.UserGroup,
        member.CognitoMemberDefinition.UserPool,
        'sistya+2@amazon.com')

}

getWorkTeamDetails = async (workTeamName) => {
    const params = {
        WorkteamName: workTeamName
    };
    return await sagemaker.describeWorkteam(params).promise();
}

getUsersInGroup = async (groupName, userPoolId) => {
    const params = {
        GroupName: groupName,
        UserPoolId: userPoolId
    }
    console.log("params : " + params)
    return await cognito.listUsersInGroup(params).promise();
}

removeUserFromGroup = async (groupName, userPoolId, userName) => {
    const params = {
        GroupName: groupName,
        UserPoolId: userPoolId,
        Username: userName
    }
    return await cognito.adminRemoveUserFromGroup(params).promise();
}

addUserToGroup = async (groupName, userPoolId, userName) => {
    const params = {
        GroupName: groupName,
        UserPoolId: userPoolId,
        Username: userName
    }
    return await cognito.adminAddUserToGroup(params).promise();
}

module.exports = { main }
main()



