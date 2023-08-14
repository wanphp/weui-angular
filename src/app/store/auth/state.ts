export default <AuthState>{
  token: '',
  currentUser: {}
};

export interface AuthState {
  token: string;
  currentUser: any;
}
