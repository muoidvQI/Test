import axios from 'axios';
import ENV from './../env/index';

export const EXPIRE_TOKEN = "Token-Expired"; // value lấy theo value data của project backend CMC.TS.Helper
export enum HTTP_STATUS_CODE {
    CODE_200 = 200,
    CODE_400 = 400,
    CODE_401 = 401,
    CODE_403 = 403,
    CODE_404 = 404,
}

axios.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if (error.response.status === HTTP_STATUS_CODE.CODE_401) {
                // Response trả về Token-Expired thì tức là token đó đã hết hạn, 
                const isExpireToken = error?.response?.data === EXPIRE_TOKEN ? true : false;
                // Nếu token expire thì call hàm refreshToken, còn không tức là lỗi dữ liệu token thì thóat ra màn login
                if (isExpireToken) {
                    const userObj = JSON.parse("");
                    if (userObj?.RefreshToken) {
                        const res = await axios.post(`${ENV.apiGateway.URL + "edu/ums/account/refresh-token"}`, {
                            refreshToken: userObj?.RefreshToken,
                            accessToken: userObj?.AccessToken
                        })
                        if (res.status === HTTP_STATUS_CODE.CODE_200) {
                            //Call thành công refreshToken thì set lại AccessToken và RefreshToken mới và call lại request bị 401
                            setToken(res?.data?.AccessToken);
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
            } else if (error.response.status === HTTP_STATUS_CODE.CODE_403) {
            } else {
                // Các status code khác 200 và 401 thì show toast
                let errorMsg = "";
                if (error.response?.config?.url?.includes("http")) {
                    errorMsg = "API lỗi " + error?.response?.status + ": " + error.response?.config?.url;
                } else {
                    errorMsg = "API lỗi " + error?.response?.status + ": " + ENV.apiGateway.URL + "" + error.response?.config?.url
                }

            }
        } else {
        }
        return Promise.reject(error)
    }
)
export const setToken = async (token = '') => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const clearToken = async () => {
    axios.defaults.headers.common['Authorization'] = ''
}

const handleError = () => {
    localStorage.removeItem("breadcumdCustoms");
    localStorage.removeItem("parameters");
    localStorage.removeItem("pagePermissions");
    sessionStorage.clear()
    clearToken()
}

export default axios
