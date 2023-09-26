import { config } from '../../../../config/config';
import { environment } from '../../../../environments/environment';

export class OidcConstants {
    public static apiRoot = environment.rsURi + config.resourceApi;
    public static clientRoot = environment.appDomain;
    public static idpAuthority = environment.rsURi
    public static clientId = config.angularClient;
}
