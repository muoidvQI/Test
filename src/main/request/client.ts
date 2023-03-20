import { AxiosInstance, AxiosRequestConfig } from "axios";
import ENV from './../env/index';
import axios, { EXPIRE_TOKEN, HTTP_STATUS_CODE } from "./interceptor";

axios.defaults.baseURL = ENV.apiGateway.URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.post["Access-Control-Allow-Methods"] = "PUT, GET, POST";
axios.defaults.headers.post["Access-Control-Allow-Headers"] =
  "Origin, X-Requested-With, Content-Type, Accept";
axios.defaults.timeout = 360000;

class HttpClient {
  constructor() {
    const user = localStorage.getItem("user");
    if (user) {
      const access_token = (JSON.parse(user ?? ""))?.AccessToken;
      if (access_token) {
        this.init(access_token);
      }
    }
  }

  async init(access_token: string) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  }

  async get(endpoint: string, config: AxiosRequestConfig = {}) {
    try {
      const response = await axios.get(endpoint, config);

      return response;
    } catch (error) {
      //this.handleError(error);
    }
  }

  async post(endpoint: string, body: {}, config: AxiosRequestConfig = {}) {
    try {
      const response = await axios.post(endpoint, body, config);

      return response;
    } catch (error) {
      //this.handleError(error);
    }
  }

  async put(endpoint: string, body: {}, config: AxiosRequestConfig = {}) {
    try {
      const response = await axios.put(endpoint, body, config);
      return response;
    } catch (error) {
      //this.handleError(error);
    }
  }

  async delete(endpoint: string, config?: {}) {
    try {
      const response = await axios.delete(endpoint, config);
      return response;
    } catch (error) {
      //this.handleError(error);
    }
}

  async deleterange(endpoint: string, config: AxiosRequestConfig) {
    try {
      const response = await axios.put(endpoint, config);
      return response;
    } catch (error) {
      //this.handleError(error);
    }
  }

  async upload(endpoint: string, file: any) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      //this.handleError(error);
    }
  }

 async uploadReturnBlob(endpoint: string, file: any) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob"
      });
      return response;
    } catch (error) {
      //this.handleError(error);
    }
  }

  async uploadFullOptions(endpoint: string, file: any) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob" || 'json'
      });
      return response;
    } catch (error) {
    }
  }

  handleError(error: any) {
    if (
      ("response" in error && error.response === undefined)
    ) {
      // delay(1000);
      error.recall = true;
    }
    throw error;
  }

  async uploadWithData(endpoint: string, data: {}) {
    try {
      const formData = new FormData();
      const lstKey = Object.keys(data);
      lstKey.forEach((x) => {
        formData.append(x, data[x]);
      });

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
    }
  }

}



const RequestClient = class {

  constructor() {
    const user = localStorage.getItem("user");
    if (user) {
      const access_token = (JSON.parse(user ?? ""))?.AccessToken;
      if (access_token) {
        this.init(access_token);
      }
    }
  }

  async init(access_token: string) {
    axios.defaults.headers.common["Authorization"] =  `Bearer ${access_token}`;
  }

  async headers(params: any) {
    const keys = Object.keys(params);

    keys.forEach((key) => {
      axios.defaults.headers.common[key] = params[key];
    });
  }


};


export interface ResponseModel {
  Data: any;
  Success: boolean;
  Message: string;
  StatusCode: number;
}
class EduHttpClient {
  instance: AxiosInstance;

  constructor(accessToken: string, baseUrl: string) {
    this.instance = axios.create({
      baseURL: baseUrl
    });
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    this.instance.defaults.timeout = 360000;

    function handleError() {
      localStorage.removeItem("breadcumdCustoms");
      localStorage.removeItem("parameters");
      localStorage.removeItem("pagePermissions");
      sessionStorage.clear()
      axios.defaults.headers.common['Authorization'] = ''
    }
    this.instance.interceptors.request.use(
      function (config) {
        return config;
      }, function (error) {
        return Promise.reject(error);
      });
    this.instance.interceptors.response.use(
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      res => res,
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      async error => {
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === HTTP_STATUS_CODE.CODE_401) {
            // Response trả về Token-Expired thì tức là token đó đã hết hạn, 
            const isExpireToken = error?.response?.data === EXPIRE_TOKEN ? true : false;
            // Nếu token expire thì call hàm refreshToken, còn không tức là lỗi dữ liệu token thì thoát ra màn login
            if (isExpireToken) {
              const userObj = JSON.parse("");
              if (userObj?.RefreshToken) {
                const res = await axios.post(`${ENV.apiGateway.URL + "edu/ums/account/refresh-token"}`, {
                  refreshToken: userObj?.RefreshToken,
                  accessToken: userObj?.AccessToken
                })
                if (res.status === HTTP_STATUS_CODE.CODE_200) {
                  //Call thành công refreshToken thì set lại AccessToken và RefreshToken mới và call lại request bị 401
                  axios.defaults.headers.common['Authorization'] = `Bearer ${res?.data?.AccessToken}`
                  userObj.AccessToken = res?.data?.AccessToken;
                  userObj.RefreshToken = res?.data?.RefreshToken;
                  originalRequest.headers['Authorization'] = `Bearer ${res.data?.AccessToken}`
                  return axios(originalRequest)
                }
              } else {
                handleError()
              }
            } else {
              handleError()
            }
          } else {
            // Các status code khác 200 và 401 thì show toast
            let errorMsg = "";
            if (error.response?.config?.url?.includes("http")) {
              errorMsg = "API lỗi " + error?.response?.status + ": " + error.response?.config?.url
            } else {
              errorMsg = "API lỗi " + error?.response?.status + ": " + ENV.apiGateway.URL + "" + error.response?.config?.url
            }
          }
        } else {
        }
        return Promise.reject(error)
      }
    )
  }

  public async get(path: string) {
    try {
      const { data } = await this.instance.get(path);
      return data as ResponseModel;
    } catch (error) {
      console.error(error)
    }
  }

  public async put(path: string, body: any) {
    try {
      const { data } = await this.instance.put(path, body);
      return data as ResponseModel;
    } catch (error) {
      console.error(error)
    }
  }

  public async post(path: string, body: any) {
    try {
      const { data } = await this.instance.post(path, body);
      return data as ResponseModel;
    } catch (error) {
      console.error(error)
    }
  }

  public async delete(path: string) {
    try {
      const { data } = await this.instance.delete(path);
      return data as ResponseModel;
    } catch (error) {
      console.error(error);
    }
  }
}

export const GetEDuHttpClient = (accessToken: string) => {
  return new EduHttpClient(accessToken, ENV.apiGateway.URL ?? "");
}

const client = new HttpClient();

export { client };

