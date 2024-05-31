import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear"; // 导入插件
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn"; // 导入本地化语言

dayjs.extend(isLeapYear); // 使用插件
dayjs.extend(relativeTime);
dayjs.locale("zh-cn"); // 使用本地化语言

export const formatDate = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const formatDateTime = (datetime: string, format: string) => {
  return dayjs(datetime, format).format("YYYY-MM-DD HH:mm");
};

export default dayjs;
