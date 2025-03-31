import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Avatar from './Avatar';

type Profile = {
  username: string | null;
  website: string | null;
  avatar_url: string | null;
};

type AccountProps = {
  session: import('@supabase/supabase-js').Session;
};

export default function Account({ session }: AccountProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({ username: null, website: null, avatar_url: null });

  useEffect(() => {
    const ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;
      const { data, error } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setProfile({ ...data });
        }
      }
      setLoading(false);
    }
    getProfile();
    return () => {};
  }, [session]);

  async function updateProfile(event: React.FormEvent, avatarUrl: string | null) {
    event.preventDefault();
    setLoading(true);
    const { user } = session;
    const updates = {
      id: user.id,
      username: profile.username,
      website: profile.website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };
    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      alert(error.message);
    } else {
      setProfile((prevProfile) => ({ ...prevProfile, avatar_url: avatarUrl }));
    }
    setLoading(false);
  }

  return (
    <form onSubmit={(event) => updateProfile(event, profile.avatar_url)} className="form-widget">
      <Avatar
        url={profile.avatar_url}
        size={150}
        onUpload={(event, url) => updateProfile(event, url)}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          required
          value={profile.username || ''}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={profile.website || ''}
          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
        />
      </div>
      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>
      <div>
        <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </form>
  );
}