//** TESTING SERVICES */

var location = window.location;
var OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
var OPENVIDU_SERVER_SECRET = "MY_SECRET";

export function getToken(mySessionId) {
  console.log(mySessionId);
  return createSession(mySessionId).then((sessionId) => createToken(sessionId));
}

export function createSession(sessionId) {
  return new Promise((resolve, reject) => {
    fetch(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", {
      method: "POST",
      body: JSON.stringify({ customSessionId: sessionId }),
      headers: {
        Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.status === 409) {
          return { id: sessionId };
        }
        return r.json();
      })
      .then((d) => {
        resolve(d.id);
      })
      .catch((error) => {
        if (error.status === 409) {
          resolve(sessionId);
        } else {
          console.warn(
            "No connection to OpenVidu Server. This may be a certificate error at " +
              OPENVIDU_SERVER_URL
          );
          if (
            window.confirm(
              'No connection to OpenVidu Server. This may be a certificate error at "' +
                OPENVIDU_SERVER_URL +
                '"\n\nClick OK to navigate and accept it. ' +
                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                OPENVIDU_SERVER_URL +
                '"'
            )
          ) {
            location.assign(
              OPENVIDU_SERVER_URL + "/openvidu/accept-certificate"
            );
          }
        }
      });
  });
}

export function createToken(sessionId) {
  return new Promise((resolve, reject) => {
    fetch(
      OPENVIDU_SERVER_URL +
        "/openvidu/api/sessions/" +
        sessionId +
        "/connection",
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          Authorization:
            "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
          "Content-Type": "application/json",
        },
      }
    )
      .then((r) => r.json())
      .then((d) => resolve(d.token))
      .catch((error) => reject(error));
  });
}
