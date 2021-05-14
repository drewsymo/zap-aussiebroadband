const test = (z, bundle) => {
  return z.request({
    url: "https://myaussie-api.aussiebroadband.com.au/customer?v=2",
  });
};

const extractCookie = (header) => {
  return header.split(";")[0];
};

const getSessionKey = (z, bundle) => {
  const promise = z.request({
    method: "POST",
    url: "https://myaussie-auth.aussiebroadband.com.au/login",
    body: {
      username: bundle.authData.username,
      password: bundle.authData.password,
    },
  });

  return promise.then((response) => {
    if (response.status === 422) {
      throw new Error("The username/password you supplied is invalid");
    }

    const cookie = response.getHeader("Set-Cookie");

    if (!cookie) {
      throw new Error("No cookie returned in response headers");
    }

    return {
      sessionKey: extractCookie(cookie),
    };
  });
};

const includeSessionKeyHeader = (request, z, bundle) => {
  if (bundle.authData.sessionKey) {
    request.headers = request.headers || {};
    request.headers["Cookie"] = bundle.authData.sessionKey;
  }

  return request;
};

module.exports = {
  config: {
    type: "session",
    sessionConfig: { perform: getSessionKey },
    fields: [
      { key: "username", label: "Username", required: true },
      {
        key: "password",
        label: "Password",
        required: true,
        type: "password",
      },
    ],
    test,
    connectionLabel: "{{json.billing_name}} {{json.customer_number}}",
  },
  befores: [includeSessionKeyHeader],
  afters: [],
};
