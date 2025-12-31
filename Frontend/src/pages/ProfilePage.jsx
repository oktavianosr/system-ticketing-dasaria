import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';
import PasswordForm from '../components/profile/PasswordForm';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className="profile-page">
            <ProfileHeader user={user} />
            <div className="profile-content">
                <ProfileForm />
                <hr />
                <PasswordForm />
            </div>
        </div>
    );
};
export default ProfilePage;
