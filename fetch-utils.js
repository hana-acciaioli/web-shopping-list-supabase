const SUPABASE_URL = 'https://xflvvifvtiottijjafxv.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbHZ2aWZ2dGlvdHRpamphZnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQyOTQ3NTIsImV4cCI6MTk3OTg3MDc1Mn0.idta3hjAHwlVQERgKkABojh4PQz1XKeehESdU7w1QJ8';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */

export async function createList(list) {
    return await client.from('lists').insert(list).single();
}

export async function getList() {
    return await client.from('lists').select('*').order('created_at');
}

export async function purchasedItem(id) {
    return await client.from('lists').update({ bought: true }).eq('id', id).single();
}

export async function deleteAllLists() {
    const user = getUser();

    return await client.from('lists').delete().eq('user_id', user.id);
}
export async function deletePurchasedLists(id) {
    return await client.from('lists').delete().match({ bought: true }).eq('user_id', id);
}
