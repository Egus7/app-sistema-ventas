import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { retry, catchError, switchMap, tap, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RestApiService implements HttpInterceptor { 
  apiUrl = 'http://localhost:4000';

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor( private http: HttpClient) {
    // Recuperar el estado de inicio de sesión desde el almacenamiento local al inicio
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedLoggedIn) {
      this.loggedIn.next(JSON.parse(storedLoggedIn));
    }

  }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })  
  }

  /** Usuarios */

  // Método para verificar si el usuario ha iniciado sesión, si no ha iniciado vuelve a login
  isLoggedOn(): boolean {
    // Obtén el token del almacenamiento local
    const token = localStorage.getItem('access_token');
    
    // Devuelve true si el token existe, de lo contrario, false
    return !!token;
  }

  // Método para verificar si el usuario ha iniciado sesión
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Método para realizar la solicitud de inicio de sesión
  login(credentials: { codigo_usuario: string, contrasenia_usuario: string }): Observable<any> {
    const url = `${this.apiUrl}/usuarios/login`;

    return this.http.post(url, credentials).pipe(
      tap((response: any) => {
        // Almacenar el token en el almacenamiento local
        localStorage.setItem('access_token', response.token);
        // Almacenar el estado de inicio de sesión en el almacenamiento local
        localStorage.setItem('isLoggedIn', 'true');
        // Almacenar el código de usuario en el almacenamiento local
        localStorage.setItem('codigo_usuario', credentials.codigo_usuario);
        // Notificar a los observadores que el usuario ha iniciado sesión
        this.loggedIn.next(true);

      })  
    );
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('codigo_usuario');
    this.loggedIn.next(false);
  }
  
  getCodigoUsuario(): string | null {
    if (this.loggedIn.value) {
      return localStorage.getItem('codigo_usuario');
    }
    return null;
  }

  // Método para registrar un nuevo usuario
  register(newUser: any): Observable<any> {
    const url = `${this.apiUrl}/usuarios/registroUsuarios`; // Ajusta la URL según tu API
    return this.http.post<any>(url, JSON.stringify(newUser), this.httpOptions)
      .pipe(  
        retry(1),
        catchError(this.handleError)
      );
  }

  /** Productos */
  // HttpClient API get() method = Fetch productos list
  getProductos(): Observable<any> {

    return this.http.get<any>(this.apiUrl + '/productos')  
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  
  // HttpClient API get() method = Fetch producto list for ID
  getProductoById(id:any): Observable<any> {
    const url = `${this.apiUrl}/productos/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  // HttpClient API post() method = Fetch productos list
  createProducto(producto:any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/productos', JSON.stringify(producto), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API put() method = Fetch productos list
  updateProducto(id:any, producto:any): Observable<any> {
    const url = `${this.apiUrl}/productos/${id}`;

    return this.http.put<any>(url, JSON.stringify(producto), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API delete() method = Fetch productos list
  deleteProducto(id:any) {
    return this.http.delete<any>(this.apiUrl + '/productos/' + id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  /** Categorias */
  // HttpClient API get() method = Fetch categorias list
  getCategorias(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/categorias')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API get() method = Fetch categoria list for ID
  getCategoriaById(id: any): Observable<any> {
    const url = `${this.apiUrl}/categorias/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API post() method = Fetch categoria list
  createCategoria(categoria:any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/categorias`,JSON.stringify(categoria), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API put() method = Fetch categoria list
  updateCategoria(id:any, producto:any): Observable<any>{
    const url = `${this.apiUrl}/categorias/${id}`;

    return this.http.put<any>(url, JSON.stringify(producto), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API delete() method = Fetch categoria list
  deleteCategoria(id:any){
    const url = `${this.apiUrl}/categorias/${id}`;

    return this.http.delete<any>(url, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /** Marcas */
  // HttpClient API get() method = Fetch marcas list
  getMarcas(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/marcas')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API get() method = Fetch marca list for ID
  getMarcaById(id: any): Observable<any> {
    const url = `${this.apiUrl}/marcas/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API post() method = Fetch marca list
  createMarca(marca:any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/marcas`, JSON.stringify(marca), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API put() method = Fetch marca list
  updateMarca(id:any, marca:any): Observable<any>{
    const url = `${this.apiUrl}/marcas/${id}`;

    return this.http.put<any>(url, JSON.stringify(marca), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  // HttpClient API delete() method = Fetch marca list
  deleteMarca(id:any){
    const url = `${this.apiUrl}/marcas/${id}`;

    return this.http.delete<any>(url, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /** Clientes */
  // HttpClient API get() method = Fetch cliente list
  getClientes(): Observable<any> {
    const url = `${this.apiUrl}/clientes`;
    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API get() method = Fetch clientes list for ID
  getClienteById(id: any): Observable<any> {
    const url = `${this.apiUrl}/clientes/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  // HttpClient API post() method = Fetch clientes list
  createCliente(cliente:any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/clientes`, JSON.stringify(cliente), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  // HttpClient API put() method = Fetch clientes list
  updateCliente(id:any, cliente:any): Observable<any>{
    const url = `${this.apiUrl}/clientes/${id}`;

    return this.http.put<any>(url, JSON.stringify(cliente), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  // HttpClient API delete() method = Fetch cliente list
  deleteCliente(id:any){
    const url = `${this.apiUrl}/clientes/${id}`;

    return this.http.delete<any>(url, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /** Proveedores */
  // HttpClient API get() method = Fetch proveedores list
  getProveedores(): Observable<any> {
    const url = `${this.apiUrl}/proveedores`;
    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API get() method = Fetch proveedores list for ID
  getProveedorById(id: any): Observable<any> {
    const url = `${this.apiUrl}/proveedores/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  // HttpClient API post() method = Fetch proveedores list
  createProveedor(cliente:any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/proveedores`, JSON.stringify(cliente), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  // HttpClient API put() method = Fetch proveedores list
  updateProveedor(id:any, cliente:any): Observable<any>{
    const url = `${this.apiUrl}/proveedores/${id}`;

    return this.http.put<any>(url, JSON.stringify(cliente), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  // HttpClient API delete() method = Fetch proveedor list
  deleteProveedor(id:any){
    const url = `${this.apiUrl}/proveedores/${id}`;

    return this.http.delete<any>(url, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /** Compras */
  // HttpClient API get() method = Fetch compras list
  getCompras(): Observable<any> {
    const url = `${this.apiUrl}/compras`;
    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API get() method = Fetch compras list for ID
  getCompraById(id: any): Observable<any> {
    const url = `${this.apiUrl}/compras/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API get() method = Fetch detalle_compras mediante compra_id list:
  getDetalleCompraById(id: any): Observable<any> {
    const url = `${this.apiUrl}/compras/detallecompras/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API post() method = Fetch compras list
  createCompra(compra:any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/compras/registrarcompras`, JSON.stringify(compra), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /** Ventas */
  // HttpClient API get() method = Fetch ventas list
  getVentas(): Observable<any> {
    const url = `${this.apiUrl}/ventas`;
    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API get() method = Fetch ventas list for ID
  getVentaById(id: any): Observable<any> {
    const url = `${this.apiUrl}/ventas/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API get() method = Fetch detalle_ventas mediante venta_id list:
  getDetalleVentaById(id: any): Observable<any> {
    const url = `${this.apiUrl}/ventas/detalleventas/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API post() method = Fetch ventas list
  createVenta(venta:any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/ventas/registrarventas`, JSON.stringify(venta), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /** Facturas */
  // HttpClient API get() method = Fetch facturas list
  getFacturas(): Observable<any> {
    const url = `${this.apiUrl}/facturas`;
    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API get() method = Fetch facturas list for ID
  getFacturaById(id: any): Observable<any> {
    const url = `${this.apiUrl}/facturas/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API get() method = Fetch factura_cab, y factura_detalle mediante factura_id list:
  getDetalleFacturaCabById(id: any): Observable<any> {
    const url = `${this.apiUrl}/facturas/${id}/detalle`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // HttpClient API post() method = Fetch facturas list
  createFactura(factura:any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/facturas/registrarfacturas`, JSON.stringify(factura), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /** Inventario */
  // HttpClient API get() method = Fetch inventario list
  getInventario(): Observable<any>   {
    const url = `${this.apiUrl}/inventario`;
    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // HttpClient API get() method = Fetch inventario list for ID
  getInventarioById(id: any): Observable<any> {
    const url = `${this.apiUrl}/inventario/${id}`;

    return this.http.get<any>(url)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  //Manejo de errores
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
