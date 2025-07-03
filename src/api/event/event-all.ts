import type { IActivityItem } from "@/models/activity";
import { request } from "@/api/request";

interface IActivityListApiResponse {
    lang: string;
    data: IActivityItem[];
}

export async function allEventsListApi(): Promise<IActivityItem[]> {
    // return request<IActivityItem[]>({
    //     url: '/api/events/all',
    //     method: 'GET',
    // });
    return Promise.resolve([
        {
            id: 4,
            name: "城市马拉松",
            slogan: "为慈善而跑，传递爱与希望",
            coverImage: "https://readdy.ai/api/search-image?query=City%20marathon%20charity%20run%20event%2C%20diverse%20runners%20with%20race%20numbers%2C%20urban%20setting%20with%20landmarks%2C%20morning%20light%2C%20colorful%20running%20outfits%2C%20atmosphere%20of%20determination%20and%20community%20spirit%2C%20centered%20composition&width=330&height=220&seq=4&orientation=landscape",
            startDate: "2025-07-15T08:00:00",
            endDate: "2025-07-15T12:00:00",
            progress: 100,
            location: "城市中心公园",
            numberOfParticipants: 1024,
            enrollStatus: null
        },
        {
            id: 5,
            name: "食品捐赠日",
            slogan: "解决食品浪费，帮助弱势群体",
            coverImage: "https://readdy.ai/api/search-image?query=Food%20donation%20day%2C%20volunteers%20sorting%20food%20packages%2C%20food%20bank%20setting%2C%20people%20donating%20groceries%2C%20organized%20shelves%20with%20supplies%2C%20warm%20lighting%2C%20showing%20generosity%20and%20community%20support%2C%20centered%20composition&width=330&height=220&seq=5&orientation=landscape",
            startDate: "2025-07-20T09:00:00",
            endDate: "2025-07-20T15:00:00",
            progress: 70,
            location: "社区服务中心",
            numberOfParticipants: 432,
            enrollStatus: null
        },
        {
            id: 6,
            name: "艺术疗愈工坊",
            slogan: "通过艺术创作缓解心理压力",
            coverImage: "https://readdy.ai/api/search-image?query=Art%20therapy%20workshop%2C%20people%20painting%20and%20creating%20art%20together%20in%20bright%20studio%2C%20art%20supplies%20and%20colorful%20canvases%2C%20supportive%20atmosphere%2C%20diverse%20group%20engaged%20in%20creative%20expression%2C%20natural%20lighting%2C%20centered%20composition&width=330&height=220&seq=6&orientation=landscape",
            startDate: "2025-07-22T13:00:00",
            endDate: "2025-07-22T17:00:00",
            progress: 30,
            location: "艺术中心",
            numberOfParticipants: 86,
            enrollStatus: null
        },
        {
            id: 7,
            name: "海滩清洁行动",
            slogan: "保护海洋生态，清洁海滩环境",
            coverImage: "https://readdy.ai/api/search-image?query=Beach%20cleanup%20action%2C%20volunteers%20collecting%20trash%20on%20sandy%20beach%2C%20blue%20ocean%20background%2C%20people%20with%20garbage%20bags%20and%20gloves%2C%20sunny%20day%2C%20environmental%20conservation%20effort%2C%20teamwork%20scene%2C%20centered%20composition&width=330&height=220&seq=7&orientation=landscape",
            startDate: "2025-07-25T09:00:00",
            endDate: "2025-07-25T12:00:00",
            progress: 50,
            location: "海滨公园",
            numberOfParticipants: 217,
            enrollStatus: null
        }
    ]);
}
