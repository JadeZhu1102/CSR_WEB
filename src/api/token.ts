import PageUrl from "@/config/page-url";
import { refreshTokenApi } from "@/api/auth";

interface ITokenCache {
    token: string;
    refreshToken: string;
    expiredIn: number;
    userId?: number;
}

const OneSecond = 1000;
const OneMinute = 60 * OneSecond;
/** 15秒的Token刷新缓冲时间 */
const RefreshBuffer = 15 * OneSecond;

class TokenManager {
    private cacheKey: string = 'CSR_USER_JWT_SESSION';

    private cacheData: ITokenCache | null = null;

    private refreshTimer: ReturnType<typeof setTimeout> | null = null;

    private clearRefresh() {
        if (this.refreshTimer) {
            window.clearTimeout(this.refreshTimer);
        }
    }

    private goToLoginPage() {
        uni.navigateTo({ url: PageUrl.auth.login });
    }

    private async refresh(refreshToken: string) {
        const response = await refreshTokenApi(refreshToken);
        if (response.code === 200) {
            const data = response.data;
            this.save({
                refreshToken: data.refreshToken,
                token: data.accessToken,
                expiredIn: data.expiresIn,
            });
        } 
    }

    private async initialize() {
        const tokenCache = await this.retrieve();

        if (tokenCache) {
            const now = Date.now();
            // valid
            if (tokenCache.expiredIn > now) {
                const expiredTime = tokenCache.expiredIn - now;
                this.refreshTimer = setTimeout(() => {
                    this.refresh(tokenCache.refreshToken);
                }, expiredTime);
            }
        }
    }

    public constructor() {
        this.initialize();
    }

    public save(tokenCache: ITokenCache) {
        const expiredIn = (tokenCache.expiredIn * OneMinute - RefreshBuffer);
        const expiredTime = Date.now() + expiredIn;
        tokenCache.expiredIn = expiredTime;

        this.cacheData = tokenCache;
        uni.setStorage({ key: this.cacheKey, data: tokenCache });

        if (tokenCache.refreshToken) {
            this.refreshTimer = setTimeout(() => {
                this.refresh(tokenCache.refreshToken);
            }, expiredTime);
        }
    }

    public clear() {
        this.cacheData = null;
        if (this.refreshTimer !== null) {
            clearTimeout(this.refreshTimer);
        }
        uni.removeStorage({ key: this.cacheKey });
    }

    public async retrieve(): Promise<ITokenCache | null> {
        try {
            if (this.cacheData === null) {
                const tokenCache = await uni.getStorage<ITokenCache | null>({ key: this.cacheKey });
                this.cacheData = tokenCache.data ?? null;
            }
            return this.cacheData;
        } catch (error) {
            return null;
        }
    }

    public async getToken(): Promise<string> {
        const tokenCache = await this.retrieve();

        if (tokenCache) {
            if (tokenCache.expiredIn > Date.now()) {
                return tokenCache.token;
            }
        }

        this.clearRefresh();
        this.goToLoginPage();
        throw new Error('Token does not exist or is expired');
    }

    public async getUserId(): Promise<number | undefined> {
        const tokenCache = await this.retrieve();
        return tokenCache?.userId;
    }
}

const tokenManager = new TokenManager();

export default tokenManager;