import axios from "axios";
import qs from "qs";
import dayjs from "dayjs";

import { JSDOM } from "jsdom";

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// 联想的数美配置：源代码 --> club.lenovo.com.cn --> signlist
const _smConf = {
  organization: "OiSyzKqqwO9gAy7AsaIP", //必填，组织标识，邮件中 organization 项
  appId: "default", //必填， 应用标识， 默认传值 default，其他应用标识提前联系数美协助定义
  publicKey:
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGzEbp+0og3VkzT/DUquAq0fZ+KFEZgIc8cak9rFYqQ2zgBhY9s1gprIFqY2efpQKwWhOSF/L11zn3Bdj7fjJnqQEDpwis3JaIgtBEl8lCIWaKejI9td8CRo3tOno3bmC4VuplY5X6FUGUs9E26QrV1R08TbYv2IbBhz5jVT0riwIDAQAB", //必填，私钥标识，邮件中 publicKey 项
  staticHost: "static.portal101.cn", //必填, 设置 JS-SDK 文件域名
  protocol: "https", // 如果使用 https，则设置，如不使用，则不设置这个字段
};
async function getDeviceId() {
  console.log(111);
  const browser = await puppeteer.launch({
    headless: "new", // 使用无头模式
    args: ["--no-sandbox"], // 避免沙盒权限问题
  });
  const page = await browser.newPage();
  console.log(222);

  // 1. 加载数美 SDK
  // await page.goto(
  //   "https://static.portal101.cn/dist/web/v3.0.0/fp.min.js?=" +
  //     new Date.getTime()
  // );
  // 或直接注入本地SDK
  // await page.addScriptTag({
  //   path: "./fp.min.js", // SDK 本地路径
  // });
  const smSDK = fs.readFileSync("./fp.min.js", "utf8");
  await page.addScriptTag({ content: smSDK });

  console.log(3333333, smSDK);

  // 2. 隐藏自动化特征（关键！）
  await page.evaluateOnNewDocument(() => {
    console.log(333);
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
    window.navigator.chrome = { runtime: {} }; // 模拟 Chrome 扩展
  });

  // 3. 调用 SDK 方法
  const deviceId = await page.evaluate(() => {
    console.log(444);
    return new Promise((resolve) => {
      // 初始化 SDK（根据数美文档配置参数）
      window.SMSDK.init({
        ..._smConf,
      });

      // 获取设备 ID
      window.SMSDK.getDeviceId((id) => {
        console.log(555, id);
        resolve(id);
      });
    });
  });

  await browser.close();
  return deviceId;
}

// import { JSDOM } from "jsdom";
// import { createCanvas } from "canvas";
// import fs from "fs";
// import path from "path";

let CookieValue =
  "tFBt_b693_lastvisit=1743494948; LA_F_T_10000008=1743498554503; LA_C_Id=_ck25040117091415039091374371772; LA_V_T_N_S_10000008=1743498554503; LA_C_C_Id=_sk202504011026070.67395500.5839; leid=1.qLhId4wBha0; LA_V_T_N_10000008=1743498565373; tFBt_b693_lastact=1743498559%09circle.php%09index; LA_F_T_10000001=1743498567336; LA_R_T_10000001=1743498567336; LA_M_W_10000001=_ck25040117091415039091374371772%7C10000001%7C%7C%7C; LA_F_T_10000231=1743499365596; LA_R_T_10000231=1743499365596; LA_V_T_10000231=1743499365596; LA_M_W_10000231=_ck25040117091415039091374371772%7C10000231%7C%7C%7C; _ga=GA1.3.605264071.1743499370; _gid=GA1.3.829343798.1743499370; cerpreg-passport=|2|1743499422|1746091422|bGVub3ZvSWQ6MTE6MTAwOTU2MTIwODF8bG9naW5OYW1lOjIwOjQ5MTg5NDM0NSU0MHFxJTJlY29tfG1lbWJlcklkOjEwOjE3NDYwOTE0MjJ8Z3JvdXBDb2RlOjE6MXxpc0xlbm92bzoxOjA=|ageTrhuf4Ep1ezm2w0KioH6AMh/DDcpeVBi3KsCm5Frwma0hgCP76y1tALEqwTigiNXj5eIBKPxYEAHTmaTSG0QD2Q1yxkA4pcCjB8S11D2abjkpjV8Ayl0nFA2PKqTFgQzQSgTVvyp4Ckm51WWh8O35orYiXTPghP/etPIRiUwD8tNWsqaleB4ilHELNHP03RopBuVR+6ddY6+b5x9qWUg9436sX9VAtbtaMZqQngxmlS3awPPgWCigfiGvoPJVQ5iYvqWNOgQFzBldD1NYNQ3YMcl8TMsZBy7SglK95eaZ/+GLXJlM4M/3LZ2nD8rpDNtaH4VzFWMv0gtjUIwsSQ==|; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2210095612081%22%2C%22first_id%22%3A%22195f09cabc14c0-0323bfaa98afdd2-26001f51-921600-195f09cabc21a2f%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTk1ZjA5Y2FiYzE0YzAtMDMyM2JmYWE5OGFmZGQyLTI2MDAxZjUxLTkyMTYwMC0xOTVmMDljYWJjMjFhMmYiLCIkaWRlbnRpdHlfbG9naW5faWQiOiIxMDA5NTYxMjA4MSJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%2210095612081%22%7D%2C%22%24device_id%22%3A%22195f09cabc14c0-0323bfaa98afdd2-26001f51-921600-195f09cabc21a2f%22%7D; LA_V_T_10000001=1743501044225; LA_M_W_10000008=_ck25040117091415039091374371772%7C10000008%7C%7Cpc_888%7Cpc_pc_common; tFBt_sns_lenovo_init=d6aclAVc0b1eJEKGWg411faB3sNKpiAKYjw3LRo%2BwFZ2RIjPCaDeQcoHVqzSXZhpsKjzDkWKpbSC5Ybi1jHHcx6%2BE6GyWnRdG%2FCxYWOzZGozbgzLD86v94xZb1NotrH3CdVVre%2BLS%2FCj8MT6OzHdWcm50GrGHdzCFBBAiUFfOWi8l0cz2IPvzqFV%2B9qjJLzpbqRU74Y2Vate2USkxI3SDdGaZhmuv6oYNg7gsAiVx8%2Bsf9MZjHF4ruA71gngty3tPQb5zVYphoNZAWpxLXIlDb0XIE8nSVL9SMMQBfQqK%2FHHPBKM0sdzSq5hxNg5HeRbo5WYHB6qoe1jKPWnBIa5oPhQMPPwBjh6d%2Fe5Uh5mqDa2cFac3QX2z1giY49sJmMwuoFF0SjE03vjQqD1RXIP7HKF3ipjbpqAcrKWysHw9dMZjCsOyUuvqV%2BErUITuBHCIQjmb%2Fl6ehRliTVuqe5vv%2BntSaYjNBSaOm91nQ9t523aWA7uQUhvkugf%2BUrjVdeQVA8DaYewNl9NxAvTVJL6NRAscYnJ4QvGd9UAP%2Bg5YIyloo0YaGS%2Bj4xIHoZQlbqGoZTRGCRlCDpeUOZ2ebygQpZdlS6jkerCUNAemhjraUNUAMxvTuPzGAa4xofQ51M061uT%2FBOHv66aAqIQqfoR2NxCl2cs%2FMnwpt%2FDXgN8GNMO%2FOM279Q84kF77ieeaueSqJcqqDP4OZFnMf8aZtvcfrc2skNxlSYAurjdhyJ8v%2BYE9EbbkekDhJO8lqegOKOL0gtOReggoVcKH5aqt%2F2l%2F6VDrVzbAtlA0yzD4iNvLAG3liCgaZda7ACTkFRPGnNVPvxUq79%2FL50aJh3JFMVrY%2FRIPXog0hpHIXE4AkNCPaehs65XiLx425ZZptp2g9C3UmFU%2FbE7rXNE5F6d9hJw%2Fkp5kUuW4gsjjY4pH31J1z%2BpIla9M39rKv%2Bm8NX%2FPqY%2Fd8Equ8T28u%2F%2Be%2FsJUHGVvKo%2BLi21v32p2t02MwKJsymp6CxvG5V7X7FmgllcLzKBt4tyJla%2Bj9hU9X5Ee6tLIwevf%2BwKtzLRSw; XSRF-TOKEN=eyJpdiI6IldzMnFMVXJyTlBRMWJNcnRYWGpWZnc9PSIsInZhbHVlIjoiT2gwUkIwbHd6U1U1d1NyK0c4TWtRN2FpczNSREY2UDFEVm1RRVJpRjhZanpsWUYwVzkyZ1RINnJyWDNIKzY3QUxVTzNPbEZjeFhMV1ZuN0VyOG55bmxObnMyVm1jQzZMNnRwdVVuZmVaei9VSmwvTU1za0xNS3lqMXo2aWRkazciLCJtYWMiOiIxNDA0ZmNmZWMyODAyNjk3MzE1OGYzMDVjYjNkM2ZhMGY2NTAzZTIzNDI2MDRhMGU2NmI3NjYyNmE3MjUxOTQwIiwidGFnIjoiIn0%3D; LA_R_C_10000008=1; LA_R_T_10000008=1743561232441; LA_V_T_10000008=1743561232441; Hm_lvt_500de05052e5d5e30e8aab9788ec62bf=1742980621,1743474427,1743561233; Hm_lpvt_500de05052e5d5e30e8aab9788ec62bf=1743561233; HMACCOUNT=5DD12744E987A833; .thumbcache_fa5607ee107e2a8e0c319b41a88868c3=ugSuKNhJNYXcWWRH+3jc6+CsW1vbOgWECNAZmFsrazyyuQTZZIh+XvPpJiRqit5ifSF7Gf9Phdp1Yh3kK33qLg%3D%3D";

let signCookieValue =
  "Hm_lvt_500de05052e5d5e30e8aab9788ec62bf=1742980621,1743474427,1743561233,1743575258; HMACCOUNT=FAF8425055146D36; sajssdk_2015_cross_new_user=1; LA_F_T_10000008=1743575258384; LA_C_Id=_ck25040214273813938612035733371; LA_R_T_10000008=1743575258384; LA_V_T_10000008=1743575258384; LA_C_C_Id=_sk202504021427370.66374400.9521; leid=1.az5BQhG+euk; LA_F_T_10000001=1743575269123; LA_R_T_10000001=1743575269123; LA_V_T_10000001=1743575269123; LA_M_W_10000001=_ck25040214273813938612035733371%7C10000001%7C%7C%7C; cerpreg-passport=|2|1743576684|1746168684|bGVub3ZvSWQ6MTE6MTAwOTU2MTIwODF8bG9naW5OYW1lOjIwOjQ5MTg5NDM0NSU0MHFxJTJlY29tfG1lbWJlcklkOjEwOjE3NDYxNjg2ODR8Z3JvdXBDb2RlOjE6MXxpc0xlbm92bzoxOjA=|ZuFwTcpiBya4GzTsJsu/lxYnhYEYpuWAuzoPklKqG3CAxhwm4RjiG7/OzKQjJ5UgYD6H/xgVSx1kme81oP4TVoDR+H9cgSTOq3HUuaqTcj/+dkB4jsvR2AuKaeCMcxNBn3ERZCyoHB9LMtgYOstYWEW7gF8K9vX1c1E8YGzngsDcNAoEoS1OG+3SyzUUTCGowUumkbLAaE287zf420CXcxZfBOELOYdAxn19O0pdfrAEWRvAMYmqzfSZyHfShkYfTNop6/N6E9MXh9yqB1WHdp5/laMawJjnQULBq31ZdNfJqb7hq65M7t1wGB1J8UI1gvP3f9CUDt6neJYNSZW83g==|; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2210095612081%22%2C%22first_id%22%3A%22195f52f14c1468-0d6b3effca0f978-26001f51-921600-195f52f14c267b%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTk1ZjUyZjE0YzE0NjgtMGQ2YjNlZmZjYTBmOTc4LTI2MDAxZjUxLTkyMTYwMC0xOTVmNTJmMTRjMjY3YiIsIiRpZGVudGl0eV9sb2dpbl9pZCI6IjEwMDk1NjEyMDgxIn0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%2210095612081%22%7D%2C%22%24device_id%22%3A%22195f52f14c1468-0d6b3effca0f978-26001f51-921600-195f52f14c267b%22%7D; tFBt_sns_lenovo_init=f60a97QETj7naDlpVqcV0JOA1ry51W9JcgZE73E6rVOrD4RavU8R4a4DV2uDmtBmi85BoCbLA675%2BAqk9WttlzJMOsua1AeUrKNDZj6sXXqeBmMY8OYw42%2BotjsD72bOzEq2eItiehS3P1lSrKg3xb4C23ixdx8eUAYKKIzs%2B1RjaOdOso%2FoqOXZX6MZYfG6GwPOG%2B8RLSd6Ov42XL86HqTjWO2Xu4i4%2BIARyTokoLrmep1t3iBbZkNWFsHZNKKQPyi3aHvHKJ18Pdo1r3%2BxxepSiXDM%2Fun6Dyl%2B97zorW5IgkrN%2BVHGK9Hdqliya8FjIMBYKcaXditZe1flWZtEUXgaLO7LBJMJY0v%2BUghiHwpBaq%2BY4D%2FHRzVZxsccxkM4BBBLJO%2FN79YAJzYWvLaHCxSUtiExGP140J%2BG5Zlp%2Fdu7MrUlaNvxVcW9av7VozEIRuzu4U3sQ0q%2BWJdTKDcoFYLsJsGs3ZXCCNmEtjGT6UGXd%2B9WXNeZFP9woktr66aJ8cZybe9c1%2BkTHRXRMMG3HOFcMriSoAbIs1DI0HGchEaD9HVZNW8vfF3Akcp7Kg48MhMZ7Zu8vctkCfir9upwUJlofesbCkDcrNlrHyfRk6AwMcEwNf4ugHC7wkvczSeUtzqyjc00r3m0XkHjXvJa72Bg6M0VXzmQUmpv%2F0ZoGdcbF3LXd1pry51ByQlALOk2LPx4dVz%2FR1z2QlGCJK9nzvVcWry5mC5vhjxt2iUCYKID9Q8nzQyd%2BEls2qMyZPnpMUfdLO2KlDj46JP%2BYlLfN5xD%2BTyi4GXfg7NUmN3A%2BX2dEyIVUwNmUoePOQERRjHg9CIP7%2FwwUWH01O0e0r0Op8iuf570O%2FPavU3WrX7lw7lfgRzBWEI5Zq7jdqZ39wNf2iv7RI5RJXKGa0fy3o8wyC2a0QiAtxvcczwPQuuwMPRIk%2F%2FXTfoP0ap615URDTNRA9UWwpv9nFqcRTMG3uUilTuaLfqnZH54xRs1drhwHiFfj3jC3rIlyNjQI0OTLgRHzZW4C8lKFndFD%2Fe0nn8lA0FH4K7RRWx%2F3wdX9O0; XSRF-TOKEN=eyJpdiI6Ik9MbGhHMElSUnVGL2ZwVExiZldIU2c9PSIsInZhbHVlIjoiczZtdHR0T3pmOGtDdjBNYU5JdTV5Smw1Y2dkOExtMlpMbU90NFhHNFhzS0duMG5IcCtlaUNCVXRaS0NxRzU5L1UyaHBQeVBsWVA2SFk5YWJQeU9oVmJGTFhxUmJkSTBGK0YvUXQ5MDVyMm5vVW1uZ3FobWt3YmFYWnhIWlVYMFciLCJtYWMiOiI0ZDQ1YzhkMDJlZDU3OWIzYzM3NjgyYmM3ZWUxYjJjNzgyM2UxYTQ1OWJjMTQ1ZjVjYzdkOWE0NmU3MzI1MDM1IiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IkorM2JGTFZSdHp2Y0FuRWVMbkFwc3c9PSIsInZhbHVlIjoiZnAyb2JLQ01XWjZBVFA3STR3cW1GYml2K3ZVL0dvNzFLQklhRVArWWZqWkc3ZXpNZkprOXR0QzhNVUxVUy9PZ3g0bVQvWm4yREx0NHkwU2M5NlVBVC9ydnQrYzJHWHVYejZ4ZXlJS0ZNRWF4cGU3MHJWa09TZ01qeE55NUVkQTYiLCJtYWMiOiIwNDFlYjZmN2JjY2M0N2I5Nzc5ZTMxNjJhNmY3ZmMyMTRlMzAwMjE2ZmVmYmZmNWZiZjhhYWU5ODBiYWM2NjZlIiwidGFnIjoiIn0%3D; LA_M_W_10000008=_ck25040214273813938612035733371%7C10000008%7C%7Cpc_888%7Cpc_pc_common; Hm_lpvt_500de05052e5d5e30e8aab9788ec62bf=1743576688; .thumbcache_fa5607ee107e2a8e0c319b41a88868c3=xG+MYnbnQg9Mpyj34/dK5K765C9pD+/VeLo7eCJn9XwDrSPB7lFbweWg53Rz5qa5qpPdoT27zj2RC+os5VQVUQ%3D%3D";

// 标识，，每次登录都是唯一
// 34612337ff0f25b6180148e4263a5c40bb9febc2
let DeviceIdValue =
  "BFTvDte9A6SFaaAlZztJmaBVDVk4epHZUQRroTXoacK5UmNT/EBtH4L6xJrCF4pK0kMZFmjmeth8NXLl7eEvbpA==";

const headers = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  Host: "reg.lenovo.com.cn",
  Origin: "https://reg.lenovo.com.cn",
  Pragma: "no-cache",
  Referer: "https://reg.lenovo.com.cn/user_auth/toc/",
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": "Windows",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
};

// 重试标识，小于3则重试
let errGetAccessCode = 0;
let errGetTokenCode = 0;
let errRunStepCode = 0;

// 延迟执行函数，github如果不间断发送请求，很大概率会失败
function delay(time = 5000) {
  // 默认5s
  return new Promise((resolve) => setTimeout(resolve, time));
}

// 签到列表
async function getSignInList() {
  const url = "https://i.lenovo.com.cn/taskCenter/getAllTask.jhtml";

  const params = {
    callback: "jQuery18308325256309510225_1743496371801",
    sts: "e40e7004-4c8a-4963-8564-31271a8337d8",
    status: "0",
    orderBy: "0",
    pageNum: "1",
    pageSize: "999",
    bu: "2",
    source: "12",
    continueSignDays: "0",
    _: new Date().getTime(),
    deviceId: DeviceIdValue,
  };

  // 请求
  try {
    const response = await axios.get(
      url,
      {
        params: params,
      },
      {
        headers: {
          ...headers,
          Cookie: CookieValue,
          Accept: "*/*",
          Host: "i.lenovo.com.cn",
          Referer: "https://club.lenovo.com.cn/",
          Pragma: "no-cache",
          "Sec-Fetch-Dest": "script",
          "Sec-Fetch-Mode": "no-cors",
          "Sec-Fetch-Site": "same-site",
        },
        transformRequest: [
          // 借用qs插件实现序列化
          (data) => {
            return qs.stringify(data);
          },
        ],
      }
    );

    const responseData = response.data;
    // 使用正则表达式提取 data 下的 rows 数组
    const match = responseData.match(/"rows":\s*(\[[^\]]*\])/);
    if (match && match[1]) {
      const rowsStr = match[1];
      const rows = JSON.parse(rowsStr);
      console.log("获取签到列表", rows);
      handleSignIn(rows);
    } else {
      console.log("未找到签到列表的 rows 数组");
    }
  } catch (e) {
    console.log("获取签到列表失败", e);
  }
}

// 处理签到逻辑，遍历，隔20s进行下一个
async function handleSignIn(rows) {
  const list = rows.filter((item) => item.note === "浏览8s得5乐豆");
  const errorList = [];

  if (list.length > 0) {
    // 遍历list数组。每隔20s, 访问一个地址
    for (const item of list) {
      const viewTaskInfo = JSON.parse(item.taskLinkInfo);
      const { viewTaskPcLinkUrl } = viewTaskInfo;
      if (viewTaskPcLinkUrl) {
        try {
          await axios.get(viewTaskPcLinkUrl, {
            headers: {
              ...headers,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
              Cookie: CookieValue,
              Host: "tk.lenovo.com.cn",
              Referer: "https://club.lenovo.com.cn/",
              "Sec-Ch-Ua-Mobile": "?0",
              "Sec-Ch-Ua-Platform": "Windows",
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "same-site",
              "Sec-Fetch-User": "?1",
              "Upgrade-Insecure-Requests": "1",
            },
          });
          console.log(`签到访问地址成功: ${viewTaskPcLinkUrl}`);
        } catch (e) {
          console.log(`签到访问地址失败: ${viewTaskPcLinkUrl}`, e);
          errorList.push(item);
        }
        await delay(20000); // 延迟20秒
      }
    }

    // 重新遍历错误的item
    if (errorList.length > 0) {
      console.log("重新尝试访问失败的地址...");
      for (const item of errorList) {
        const viewTaskInfo = JSON.parse(item.taskLinkInfo);
        const { viewTaskPcLinkUrl } = viewTaskInfo;
        if (viewTaskPcLinkUrl) {
          try {
            await axios.get(viewTaskPcLinkUrl, {
              headers: {
                ...headers,
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                Cookie: CookieValue,
                Host: "item.lenovo.com.cn",
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": "Windows",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1",
              },
            });
            console.log(`重新签到访问地址成功: ${viewTaskPcLinkUrl}`);
          } catch (e) {
            console.log(`重新签到访问地址失败: ${viewTaskPcLinkUrl}`, e);
          }
          await delay(20000); // 延迟20秒
        }
      }
    }
  } else {
    console.log("没有需要签到的任务");
  }
}

// 访问签到页面，并找出_token
async function viewSignInPage() {
  const url = "https://club.lenovo.com.cn/signlist";
  // 请求
  try {
    const response = await axios.get(
      url,
      {},
      {
        headers: {
          ...headers,
          Cookie: signCookieValue,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          Host: "club.lenovo.com.cn",
          Pragma: "no-cache",
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": "Windows",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
        },
      }
    );
    const htmlString = response.data;
    // 使用jsdom解析HTML
    // const dom = new JSDOM(htmlString, {
    //   runScripts: "dangerously",
    //   resources: "usable",
    // });
    // 等待所有脚本执行完毕（可能需要额外的等待时间或检查）
    // 由于jsdom的'runScripts'设置为'dangerously'，脚本会立即执行，但有时可能需要额外的处理来确保DOM完全加载
    // 例如，你可以通过检查特定的DOM元素或使用setTimeout来模拟浏览器的加载行为
    // await delay(20000);

    // 你可以在这里访问修改后的DOM
    // console.log(dom.serialize()); // 输出修改后的HTML

    // console.log(111, response);
    // 使用正则表达式提取 $CONFIG.shumeideviceId 的值
    const matchs = htmlString.match(/var\s+shumeideviceId\s*=\s*'([^']*)'/);
    console.log("未找到 $CONFIG.shumeideviceId 的值", matchs);

    // if (match && match[1]) {
    //   const shumeideviceId = match[1];
    //   console.log("shumeideviceId:", shumeideviceId); // 输出: exampleDeviceId12345
    // } else {
    //   console.log("未找到 $CONFIG.shumeideviceId 的值");
    // }

    return;
    // 使用正则表达式提取 $CONFIG.token 的值
    const match = htmlString.match(/\$CONFIG\.token\s*=\s*"([^"]+)"/);

    if (match && match[1]) {
      const token = match[1];
      return token;
      console.log("访问签到列表得到的Token:", token); // 输出: k49WZ1x8SfapsLHgb0NWC4u917Zz0AhmbRqZRz3A
    } else {
      console.log("未找到 $CONFIG.token 的值");
      return null; // 未找到时返回null
    }
  } catch (error) {
    console.log("访问签到页面失败", error);
    return null; // 未找到时返回null
  }
}
// 签到
async function handleSign() {
  const token = await viewSignInPage(); // 获取token
  if (!token) {
    console.log("无法获取token，无法进行签到");
    // 发送邮件通知
    return;
  }

  return;
  const url = "https://club.lenovo.com.cn/sign";

  const params = {
    _token: token,
    deviceId: DeviceIdValue,
  };

  // 请求
  try {
    const response = await axios.post(url, params, {
      headers: {
        ...headers,
        Cookie: CookieValue,
        Host: "club.lenovo.com.cn",
        Origin: "https://club.lenovo.com.cn",
        Pragma: "no-cache",
        Referer: "https://club.lenovo.com.cn/signlist",
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": "Windows",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "X-Requested-With": "XMLHttpRequest",
      },
      transformRequest: [
        // 借用qs插件实现序列化
        (data) => {
          return qs.stringify(data);
        },
      ],
    });
    console.log("签到成功", response.data);
  } catch (error) {
    console.log("签到失败", error);
  }

  // 发送刷步数请求
  getSignInList();
}

// 获取数美 DeviceId
// 数美官网：https://help.ishumei.com/docs/tw/sdk/web/developDoc
// 联想地址：network中查找：fp.min.js
async function getSignDeviceId() {
  const url = "https://static.portal101.cn/dist/web/v3.0.0/fp.min.js?";
}

// 主程序
async function signIn() {
  // const userInfo = JSON.parse(process.env.CONFIG || "{}");
  // if (Object.keys(userInfo).length === 0) {
  //   throw Error("获取账号信息失败");
  // } else {
  //   computedStepCount(userInfo);
  // }

  // 执行
  const res = await getDeviceId();
  console.log("DeviceID:", res);

  // 签到
  handleSign();
}
signIn();

// 根据北京时间,在一定的时间内，刷对应的步数
function getBejinTime(userInfo) {
  //  获取北京时间,在一定的时间内，刷对应的步数
  try {
    const niuyueFullTime = dayjs().endOf().format("YYYY-MM-DD HH:mm:ss");
    const niuyueHour = dayjs().startOf("hour").format("HH");
    const minute = dayjs().startOf("minute").format("mm");
    const hour = niuyueHour * 1 + 8;

    // 北京时间比美国纽约时间少8小时，需要加上
    console.log("美国纽约时间：", niuyueFullTime); // 输出：2025-01-05 18:42:14+
    console.log("当前美国小时：", niuyueHour); // 输出：2025-01-05 18:42:14+
    console.log("当前北京小时：", hour); // 输出：18
    console.log("当前分钟数：", minute); // 输出：42
  } catch (error) {
    throw Error(error || "北京时间获取失败");
  }
}
