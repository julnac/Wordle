import apiClient from "./apiClient";
import {Profile, UpdateProfileRequest} from '../types/profile';

export const ProfileService = {

    getProfile: async (): Promise<Profile> => {
        const response = await apiClient.get<Profile>('/user-service/api/user/profile');
        return response.data;
    },

    // PUT: EditProfile
    updateProfile: async (event: Partial<UpdateProfileRequest>): Promise<Profile> => {
        const response = await apiClient.put<Profile>('/user-service/api/user/profile', event);
        return response.data;
    }
};


// Aktualizuj profil użytkownika
// export async function updateUserProfile(profile: any) {
//     const res = await fetchWithAuth(`/user-service/api/user/profile`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(profile),
//     });
//     if (!res.ok) throw new Error('Nie udało się zaktualizować profilu');
//     return res.json();
// }