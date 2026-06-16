import api from './client'

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface UserOut {
  id: string
  username: string | null
  name: string
  avatar: string | null
  level: string
  constitution: string
  is_guest: boolean
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: UserOut
}

export const loginGuest = (): Promise<TokenResponse> =>
  api.post('/auth/login', { guest: true }).then((r) => r.data)

export const loginWithPassword = (username: string, password: string): Promise<TokenResponse> =>
  api.post('/auth/login', { username, password }).then((r) => r.data)

export const register = (username: string, password: string): Promise<TokenResponse> =>
  api.post('/auth/register', { username, password }).then((r) => r.data)

export const loginPhone = (phone: string): Promise<TokenResponse> =>
  api.post('/auth/login', { phone }).then((r) => r.data)

export const getMe = (): Promise<UserOut> =>
  api.get('/auth/me').then((r) => r.data)

export const updateMe = (data: Partial<Pick<UserOut, 'name' | 'avatar' | 'constitution'>>): Promise<UserOut> =>
  api.put('/auth/me', data).then((r) => r.data)


// ── Herbs ─────────────────────────────────────────────────────────────────────

export interface HerbItem {
  id: string
  name: string
  pinyin: string
  property: string
  flavor: string
  origin: string
  description: string
  effect: string
  treatment: string[]
  research: string
  taboos: string[]
  image: string
  isFeatured: boolean
}

export const getHerbs = (params?: { featured?: boolean; search?: string }): Promise<HerbItem[]> =>
  api.get('/herbs', { params }).then((r) => r.data)

export const getHerb = (id: string): Promise<HerbItem> =>
  api.get(`/herbs/${id}`).then((r) => r.data)


// ── Recipes ───────────────────────────────────────────────────────────────────

export interface Ingredient { name: string; quantity: string; icon: string }
export interface RecipeItem {
  id: string; name: string; benefits: string[]; time: string
  difficulty: string; intro: string; ingredients: Ingredient[]
  steps: string[]; image: string
}

export const getRecipes = (params?: { search?: string }): Promise<RecipeItem[]> =>
  api.get('/recipes', { params }).then((r) => r.data)

export const getRecipe = (id: string): Promise<RecipeItem> =>
  api.get(`/recipes/${id}`).then((r) => r.data)


// ── Workouts ──────────────────────────────────────────────────────────────────

export interface WorkoutAction { order: number; title: string; keys: string; role: string }
export interface WorkoutItem {
  id: string; name: string; subtitle: string; teacher: string
  level: string; students: number; calories: number; actionsCount: number
  intro: string; image: string; actions: WorkoutAction[]
}

export const getWorkouts = (params?: { level?: string }): Promise<WorkoutItem[]> =>
  api.get('/workouts', { params }).then((r) => r.data)

export const getWorkout = (id: string): Promise<WorkoutItem> =>
  api.get(`/workouts/${id}`).then((r) => r.data)


// ── History ───────────────────────────────────────────────────────────────────

export interface ConsultationRecord {
  id: string; title: string; date: string; type: string
  symptoms: string; analysis?: string; suggestion: string; image_url?: string
}

export const getHistory = (): Promise<ConsultationRecord[]> =>
  api.get('/history').then((r) => r.data)

export const addHistory = (data: Omit<ConsultationRecord, 'id' | 'date'>): Promise<ConsultationRecord> =>
  api.post('/history', data).then((r) => r.data)


// ── Favorites ─────────────────────────────────────────────────────────────────

export interface FavoritesOut { herbs: string[]; recipes: string[]; workouts: string[] }

export const getFavorites = (): Promise<FavoritesOut> =>
  api.get('/favorites').then((r) => r.data)

export const toggleFavorite = (item_type: string, item_id: string): Promise<FavoritesOut> =>
  api.post('/favorites/toggle', { item_type, item_id }).then((r) => r.data)


// ── Reminders ─────────────────────────────────────────────────────────────────

export interface ReminderItem {
  id: string; name: string; time: string; frequency: string; type: string; active: boolean
}

export const getReminders = (): Promise<ReminderItem[]> =>
  api.get('/reminders').then((r) => r.data)

export const addReminder = (data: Omit<ReminderItem, 'id' | 'active'>): Promise<ReminderItem> =>
  api.post('/reminders', data).then((r) => r.data)

export const toggleReminder = (id: string): Promise<ReminderItem> =>
  api.patch(`/reminders/${id}/toggle`).then((r) => r.data)


// ── Feedback ──────────────────────────────────────────────────────────────────

export const submitFeedback = (data: { type: string; content: string; email?: string }) =>
  api.post('/feedback', data).then((r) => r.data)


// ── Diagnose ──────────────────────────────────────────────────────────────────

export interface DiagnoseResult {
  title: string; diagnosis: string; advice: string
  herb_id?: string; recipe_id?: string; constitution?: string
}

export const diagnose = (symptoms: string, image_base64?: string): Promise<DiagnoseResult> =>
  api.post('/diagnose/combined', { symptoms, image_base64 }).then((r) => r.data)


// ── Chat (multi-turn conversation) ────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  reply: string
}

export const sendChatMessage = (data: {
  symptoms: string
  diagnosis: string
  advice: string
  conversation_history: ChatMessage[]
  new_message: string
}): Promise<ChatResponse> =>
  api.post('/chat', data).then((r) => r.data)


// ── Constitution ──────────────────────────────────────────────────────────────

export interface ConstitutionResult { constitution: string; description: string; advice: string }

export const getConstitutionQuestions = () =>
  api.get('/constitution/questions').then((r) => r.data)

export const evaluateConstitution = (answers: { question_id: number; score: number }[]): Promise<ConstitutionResult> =>
  api.post('/constitution/evaluate', { answers }).then((r) => r.data)
