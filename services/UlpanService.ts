import { ApiEndpoint, HttpMethod } from "../constants";
import { RequestUtil } from "../util";
import { Ulpan } from "../types";

export class UlpanService {
  public static async getUlpanById(id): Promise<Ulpan> {
    return await RequestUtil.sendRequest({
                                           uri: `${ApiEndpoint.ULPANS}/${id}`,
                                           method: HttpMethod.GET,
                                           isAuthorized: true
                                         });
  }

  public static async getAllUlpans(): Promise<Ulpan[]> {
    return await RequestUtil.sendRequest({
                                           uri: `${ApiEndpoint.ULPANS}`,
                                           method: HttpMethod.GET,
                                           isAuthorized: true
                                         });
  }

  public static async updateUlpan(id: any, body: Ulpan): Promise<Ulpan> {
    return await RequestUtil.sendRequest({
                                           uri: `${ApiEndpoint.ULPANS}/${id}`,
                                           method: HttpMethod.PUT,
                                           isAuthorized: true,
                                           body: body
                                         });
  }

  public static async createUlpan(values): Promise<Ulpan> {
    const body = {
      ulpanName: values?.ulpanName,
      description: {
        ru: values?.description_ru,
        en: values?.description_en,
        fr: values?.description_fr
      },
      contactEmail: values?.contactEmail,
      contactPhone: values?.contactPhone,
      studentsRequiredFieldsList: []
    };
    return await RequestUtil.sendRequest({
                                           uri: `${ApiEndpoint.ULPANS}`,
                                           method: HttpMethod.POST,
                                           isAuthorized: true,
                                           body
                                         })
  }
}