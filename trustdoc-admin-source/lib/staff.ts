import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
const base=process.env.TRUSTDOC_API_URL;
export async function staff(path:string, role='admin') {
 const token=(await cookies()).get('trustdoc_staff_session')?.value;
 if(!token) redirect('/auth/login');
 if(!base) throw new Error('TRUSTDOC_API_URL is not configured');
 const headers={Authorization:`Bearer ${token}`};
 const me=await fetch(`${base}/api/auth/me`,{headers,cache:'no-store'});
 if(me.status===401) redirect('/auth/login');
 if(!me.ok) throw new Error('Unable to verify staff session');
 const identity=await me.json();
 if(!identity.roles?.includes(role)) throw new Error('Access denied: staff role not granted');
 const response=await fetch(`${base}${path}`,{headers,cache:'no-store'});
 if(!response.ok) throw new Error(`Backend returned ${response.status} for ${path}`);
 return {identity,data:await response.json()};
}
