import express from 'express';
import cors from 'cors';
import Controlador from './Controlador/Controlador';
import Controlador_Acceso from './Controlador/Controlador_Acceso';
import { Tipos_Usuario } from './Modelo/Tipos_Usuario';
import { Producto } from './Modelo/Producto';
import { Estilo } from './Modelo/Estilo';
import { Creador_de_Contenido } from './Modelo/Creador_de_Contenido';
import { Carrito } from './Modelo/Carrito';
import { Pedido } from './Modelo/Pedido';
import { Direccion } from "./Modelo/Direccion";
import { Objeto_Calificacion } from './Modelo/Objeto_Calificacion';
import { Categoria } from './Modelo/Categoria';

let opciones_cors = {
    origin: ['http://186.176.18.72', 'http://201.194.192.205',
        'http://152.231.200.151', 'http://localhost:4200', 'https://audiophistic1.web.app'],
    optionsSuccessStatus: 200
}
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.json({ limit: '10mb' }));
app.use(cors(opciones_cors))

let controlador = new Controlador();
let controlador_login = new Controlador_Acceso();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("LISTENING ON PORT", PORT);
})


app.get('/', (req, res) => {
    res.send('Bienvenido a la api de Audiophistic!');
})

/* Verifica si hay un token en el request */

function hay_auth(req: express.Request, res: express.Response) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        throw new Error('Falta el header de autorización');
    };
    let token: string[] = req.headers.authorization.split(' ');
    if (token.length < 2) {
        throw new Error('Falta el token de autorización');
    }
    return token;
}


/* Verifican los diferentes tipos de autorizacion que hay */

function autorizacion_admin(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        let token: string[] = hay_auth(req, res) as string[];
        if (!controlador_login.verificar_permisos(token[1], 1)) {
            return res.send({ error: 'Acceso denegado' });
        } else {
            return next();
        }
    } catch (err: any) {
        return res.send({ error: err.message })
    }
}

function autorizacion_creador_contenido(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        let token: string[] = hay_auth(req, res) as string[];
        if (!controlador_login.verificar_permisos(token[1], 2)) {
            return res.send({ error: 'Acceso denegado' });
        } else {
            return next();
        }
    } catch (err: any) {
        return res.send({ error: err.message })
    }
}

function autorizacion_consumidor(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        let token: string[] = hay_auth(req, res) as string[];
        if (!controlador_login.verificar_permisos(token[1], 3)) {
            return res.send({ error: 'Acceso denegado' });
        } else {
            return next();
        }
    } catch (err: any) {
        return res.send({ error: err.message })
    }
}

// Inicio de sesion, se comunica con el controlador login
app.post('/registrar_usuario', (req, res) => {
    try {
        let { correo, nombre, contrasena }: { correo: string, nombre: string, contrasena: string } = req.body;
        if (nombre && correo && contrasena) {
            return controlador.registrar_usuario(correo, nombre, contrasena)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//Crear usuario, creador de contenido
app.post('/crear_usuario', autorizacion_admin, (req, res) => {
    try {
        let { correo, nombre, caracteristicas }: { correo: string, nombre: string, caracteristicas: Creador_de_Contenido } = req.body;
        if (correo && nombre && caracteristicas) {
            return controlador.crear_usuario(correo, nombre, caracteristicas)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                })
        } else {
            return res.send({ error: "Los datos están incompletos" });
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

app.post('/confirmar_usuario', (req, res) => {
    try {
        let { token }: { token: string } = req.body;
        if (token) {
            return controlador.confirmar_usuario(token)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "El token no fue enviado" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Cambio de contrasena, se comunica con el controlador
app.post('/cambiar_contrasena', (req, res) => {
    try {
        let { contrasena }: { contrasena: string } = req.body;
        let token: string = hay_auth(req, res)[1];
        if (token && contrasena) {
            controlador.cambiar_contrasena(token, contrasena)
                .then((resultado: any) => {
                    return res.send({ resultado });
                })
                .catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
});

// Envio de correo con contrasena temporal
app.post('/recuperar_contrasena', (req, res) => {
    try {
        let { correo }: { correo: string } = req.body;
        if (correo) {
            controlador.crear_contrasena_temporal(correo)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Hubo un error" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Inicio de sesion, se comunica con el controlador login
app.post('/iniciar_sesion', (req, res) => {
    try {
        let { correo, contrasena }: { correo: string, contrasena: string } = req.body;
        if (correo && contrasena) {
            return controlador_login.verificar_contrasena(correo, contrasena)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})


// Editar los datos del usuario
app.post('/editar_usuario', (req, res) => {
    try {
        let { nombre, caracteristicas }: { nombre: string, caracteristicas: Tipos_Usuario } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (token && nombre && caracteristicas !== undefined) {
            controlador.editar_usuario(token, nombre, caracteristicas)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

/* Devuelve todos los usuarios, se comunica con el controlador, 
    Solo pueden accesar con permisos de administrador */
app.get('/usuarios', autorizacion_admin, (req, res) => {
    try {
        controlador.consultar_usuarios()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/usuarios/:id_usuario', autorizacion_admin, (req, res) => {
    try {
        let id_usuario: number = parseInt(req.params.id_usuario);
        controlador.consultar_usuario(id_usuario)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve todos los datos del creador del contenido, se comunica con el controlador
app.get('/creador_contenido/:id_creador', (req, res) => {
    try {
        let id_creador: number = parseInt(req.params.id_creador);
        controlador.consultar_creador_contenido(id_creador)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

app.get('/perfil', (req, res) => {
    try {
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.consultar_perfil(token)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//Elimina un usuario
app.get('/eliminar_usuario/:id_usuario', autorizacion_admin, (req: express.Request, res) => {
    try {
        let id_usuario: number = parseInt(req.params.id_usuario);
        controlador.eliminar_usuario(id_usuario)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message })
    }
})

// Inserta un producto y todos sus datos a la base de datos
app.post('/crear_producto', autorizacion_creador_contenido, (req, res) => {
    try {
        let { producto, estilos }: { producto: Producto, estilos: Estilo[] } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (producto && estilos && token) {
            controlador.crear_producto(producto, estilos, token)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
});


app.post('/modificar_producto', autorizacion_creador_contenido, (req, res) => {
    try {
        let { producto, estilos }:
            { producto: Producto, estilos: Estilo[] } = req.body
        let token: string = (hay_auth(req, res) as string[])[1];
        if (producto && estilos && token) {
            controlador.modificar_producto(producto, estilos, token)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
});

app.post('/modificar_existencia', autorizacion_creador_contenido, (req, res) => {
    try {
        let { estilos }:
            { estilos: Estilo[] } = req.body
        let token: string = (hay_auth(req, res) as string[])[1];
        if (estilos && token) {
            controlador.modificar_existencia(token, estilos)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
});

/* Devuelve todos los usuarios, se comunica con el controlador, 
    Solo pueden accesar con permisos de administrador */
app.get('/productos', autorizacion_admin, (req, res) => {
    try {
        controlador.consultar_productos()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//Devuelve todos los productos registrados a un Creador de Contenido
app.get('/productos_por_creador/:id_creador_contenido', autorizacion_admin, (req: express.Request, res) => {
    try {
        let id_usuario: number = parseInt(req.params.id_creador_contenido);
        controlador.consultar_productos_creador(id_usuario)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//Devuelve todos los productos, mas su foto, registrados a un Creador de Contenido
app.get('/thumbnail_productos_por_creador/:id_creador_contenido', (req: express.Request, res) => {
    try {
        let id_usuario: number = parseInt(req.params.id_creador_contenido);
        controlador.thumbnail_productos_creador(id_usuario)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve los productos que ha creado el usuario dentro del token
app.get('/mis_productos', autorizacion_creador_contenido, (req: express.Request, res) => {
    try {
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.consultar_productos_usuario(token)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve los productos que ha creado el usuario dentro del token
app.get('/mis_productos_sin_blog', autorizacion_creador_contenido, (req: express.Request, res) => {
    try {
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.consultar_productos_sin_blog_creador(token)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/productos_por_tipo/:id_tipo', (req: express.Request, res) => {
    try {
        let id_producto: number = parseInt(req.params.id_tipo);
        controlador.productos_por_tipo(id_producto)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/productos/:id_producto', (req: express.Request, res) => {
    try {
        let id_producto: number = parseInt(req.params.id_producto);
        controlador.consultar_producto(id_producto)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/eliminar_producto/:id_producto', autorizacion_admin, (req: express.Request, res) => {
    try {
        let id_producto: number = parseInt(req.params.id_producto);
        controlador.eliminar_producto(id_producto)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/eliminar_mi_producto/:id_producto', autorizacion_creador_contenido, (req: express.Request, res) => {
    try {
        let id_producto: number = parseInt(req.params.id_producto);
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.eliminar_mi_producto(id_producto, token)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/estilos/:id_producto', (req: express.Request, res) => {
    try {
        let id_producto: number = parseInt(req.params.id_producto);
        controlador.consultar_estilos(id_producto)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Agrega el producto carrito del usuario
app.post('/agregar_al_carrito', autorizacion_consumidor, (req: express.Request, res) => {
    try {
        let { id_producto, id_estilo, cantidad }:
            { id_producto: number, id_estilo: number, cantidad: number } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.agregar_al_carrito(token, id_producto, id_estilo, cantidad)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Cambia la cantidad del producto del usuario
app.post('/cambiar_cantidad_carrito', autorizacion_consumidor, (req: express.Request, res) => {
    try {
        let { id_producto, id_estilo, cantidad }:
            { id_producto: number, id_estilo: number, cantidad: number } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.cambiar_cantidad_carrito(token, id_producto, id_estilo, cantidad)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

app.post('/eliminar_del_carrito', autorizacion_consumidor, (req: express.Request, res) => {
    try {
        let { id_producto, id_estilo }:
            { id_producto: number, id_estilo: number } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.eliminar_del_carrito(token, id_producto, id_estilo)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Consulta los productos del carrito de un usuario
app.get('/thumbnail_carrito', autorizacion_consumidor, (req: express.Request, res) => {
    try {
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.thumbnail_carrito(token)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Consulta los productos del carrito de un usuario
app.get('/carrito', autorizacion_consumidor, (req: express.Request, res) => {
    try {
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.consultar_carrito(token)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Consulta los productos del carrito de un usuario
app.get('/tipos_de_pago', (req: express.Request, res) => {
    try {
        controlador.consultar_tipos_de_pago()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Realizar checkout de un carrito
app.post('/checkout', autorizacion_consumidor, (req, res) => {
    try {
        let { carrito, monto_total, subtotal, costo_envio, direccion_pedido }:
            {
                carrito: Carrito[], monto_total: number, subtotal: number, costo_envio: number,
                direccion_pedido: Direccion
            } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (carrito && monto_total && direccion_pedido && subtotal && costo_envio) {
            controlador.realizar_checkout(token, carrito, monto_total, subtotal, costo_envio, direccion_pedido)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "No se pudo realizar el checkout" })
        }

    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Realizar Pago
app.post('/pagar', autorizacion_consumidor, (req, res) => {
    try {
        let { id_pedido, id_metodo_pago, monto_total, subtotal, costo_envio, comprobante, direccion_pedido }:
            {
                id_pedido: number, id_metodo_pago: number, monto_total: number, subtotal: number, costo_envio: number,
                comprobante: string, direccion_pedido: Direccion
            } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (id_pedido && id_metodo_pago && monto_total && subtotal && costo_envio && direccion_pedido) {
            controlador.realizar_pago(token, id_pedido, id_metodo_pago, monto_total, subtotal, costo_envio, comprobante, direccion_pedido)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "No se pudo completar el pago" })
        }

    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//crear una nueva categoria
app.post('/crear_categoria', autorizacion_admin, (req, res) => {
    try {
        let { nombre/*, fecha_creacion, cant_blogs*/ }: { nombre: string/*, fecha_creacion: Date, cant_blogs: number*/ } = req.body;
        if (nombre) {
            controlador.crear_categoria(nombre, /*fecha_creacion, cant_blogs*/)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message })
                })
        } else {
            return res.send({ error: "No se pudo crear Categoria" })
        }

    } catch (err: any) {
        return res.send({ error: err.message });
    }
});

//devuelve todas las categorias con metadatos para el admin
app.get('/categorias', autorizacion_admin, (req, res) => {
    try {
        controlador.consultar_categorias()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message })
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
});

//devuelve todas las categorias
app.get('/categorias_publico', (req, res) => {
    try {
        controlador.consultar_categorias_publico()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message })
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
});

// Elimina una categoria
app.get('/eliminar_categoria/:id_categoria', autorizacion_admin, (req, res) => {
    try {
        let id_categoria: number = parseInt(req.params.id_categoria);
        controlador.eliminar_categoria(id_categoria)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message })
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
});

// Crear Blog
app.post('/crear_blog', autorizacion_creador_contenido, (req, res) => {
    try {
        let { id_categoria, titulo, imagen, etiquetas, contenido, productos }:
            {
                id_categoria: number, titulo: string, imagen: string, etiquetas: string[],
                contenido: string, activo: boolean, enlace: string, productos: number[]
            } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (id_categoria && titulo && imagen && etiquetas && contenido && productos && token) {
            controlador.crear_blog(token, id_categoria, titulo, imagen, etiquetas, contenido, productos)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos del blog están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Modificar Blog
app.post('/modificar_blog', autorizacion_creador_contenido, (req, res) => {
    try {
        let { id_blog, id_categoria, titulo, imagen, etiquetas, contenido, productos }:
            {
                id_blog: number, id_categoria: number, titulo: string,
                imagen: string, etiquetas: string[], contenido: string,
                productos: number[]
            } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (token && id_blog && id_categoria && titulo && imagen && etiquetas && contenido && productos) {
            controlador.modificar_blog(token, id_blog, id_categoria, titulo, imagen,
                etiquetas, contenido, productos)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos del blog están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Consultar un Blog
app.get('/blogs/:id_blog', (req: express.Request, res) => {
    try {
        let id_blog: number = parseInt(req.params.id_blog);
        controlador.consultar_blog(id_blog)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
});

// obtiene todos los blogs
app.get('/blogs', autorizacion_admin, (req: express.Request, res) => {
    try {
        controlador.consultar_blogs()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// obtiene todos los blogs
app.get('/thumbnail_blogs', (req: express.Request, res) => {
    try {
        controlador.consultar_thumbnail_blogs()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Devuelve los productos que ha creado el usuario dentro del token
app.get('/mis_blogs', autorizacion_creador_contenido, (req: express.Request, res) => {
    try {
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.consultar_blogs_por_creador(token)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//Devuelve todos los blogs, mas su foto, registrados a un Creador de Contenido
app.get('/thumbnail_blogs_por_creador/:id_creador_contenido', (req: express.Request, res) => {
    try {
        let id_usuario: number = parseInt(req.params.id_creador_contenido);
        controlador.thumbnail_blogs_por_creador(id_usuario)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Cambia el estado de un blog a inactivo
app.get('/eliminar_blog/:id_blog', autorizacion_admin, (req, res) => {
    try {
        let id_blog: number = parseInt(req.params.id_blog);
        controlador.eliminar_blog(id_blog)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message })
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
});

// Cambia el estado de un blog del creador a inactivo
app.get('/eliminar_mi_blog/:id_blog', autorizacion_creador_contenido, (req: express.Request, res) => {
    try {
        let id_blog: number = parseInt(req.params.id_blog);
        let token: string = (hay_auth(req, res) as string[])[1];
        controlador.eliminar_mi_blog(id_blog, token)
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Crea una calificación a un Blog
app.post('/crear_calificacion_blog', autorizacion_consumidor, (req, res) => {
    try {
        let { id_origen, calificacion }: { id_origen: number, calificacion: number } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (id_origen && calificacion && token) {
            controlador.crear_calificacion_blog(token, id_origen, calificacion)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }

    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Ver mi calificacion a un Blog
app.get('/calificacion_blog/:id_origen', autorizacion_consumidor, (req, res) => {
    try {
        let id_origen: number = parseInt(req.params.id_origen);
        let token: string = (hay_auth(req, res) as string[])[1];
        if (id_origen && token) {
            controlador.consultar_calificacion_blog(token, id_origen)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }

    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Crear comentario de un blog
app.post('/crear_comentario_blog', autorizacion_consumidor, (req, res) => {
    try {
        let { id_origen, comentario }: { id_origen: number, comentario: string } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (id_origen && comentario && token) {
            controlador.crear_comentario_blog(token, id_origen, comentario)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }

    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//modificar comentario de un blog
app.post('/modificar_comentario_blog', autorizacion_consumidor, (req, res) => {
    try {
        let { id_comentario, id_origen, comentario }: { id_comentario: number, id_origen: number, comentario: string } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (id_origen && comentario && token) {
            controlador.modificar_comentario_blog(token, id_comentario, id_origen, comentario)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }

    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//consultar comentarios de un blog
app.get('/comentarios_blog/:id_origen/:cantidad_a_agregar/:pagina', (req, res) => {
    try {
        let id_origen: number = parseInt(req.params.id_origen);
        let cantidad_a_agregar: number = parseInt(req.params.cantidad_a_agregar);
        let pagina: number = parseInt(req.params.pagina)
        let token: string | undefined = req.headers.authorization;
        if (token) {
            token = token.split(' ')[1]
        }
        if (id_origen && cantidad_a_agregar && pagina) {
            controlador.consultar_comentarios_blog(token, id_origen, cantidad_a_agregar, pagina)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }

    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//Eliminar la comentario de un blog
app.get('/eliminar_comentario_blog/:id_comentario/:id_origen', autorizacion_consumidor, (req: express.Request, res) => {
    try {
        let id_comentario: number = parseInt(req.params.id_comentario);
        let id_origen: number = parseInt(req.params.id_origen);
        let token: string = (hay_auth(req, res) as string[])[1];
        if (id_comentario && id_origen && token) {
            controlador.eliminar_comentario_blog(token, id_comentario, id_origen)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }

    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

//Crear resena Producto
app.post('/crear_resena_producto', autorizacion_consumidor, (req, res) => {
    try {
        let { id_origen, comentario, calificaciones }:
            { id_origen: number, comentario: string, calificaciones: Objeto_Calificacion[] } = req.body;
        let token: string = (hay_auth(req, res) as string[])[1];
        if (id_origen && calificaciones && token) {
            controlador.crear_resena_producto(token, id_origen, comentario, calificaciones)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        }
        else {
            return res.send({ error: "Los datos para la resena están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Consultar resena producto
//consultar comentarios de un blog
app.get('/resenas_producto/:id_origen/:cantidad_a_agregar/:pagina', (req, res) => {
    try {
        let id_origen: number = parseInt(req.params.id_origen);
        let cantidad_a_agregar: number = parseInt(req.params.cantidad_a_agregar);
        let pagina: number = parseInt(req.params.pagina);
        let token: string | undefined = req.headers.authorization;
        if (token) {
            token = token.split(' ')[1]
        }
        if (id_origen && cantidad_a_agregar && pagina) {
            controlador.consultar_resenas_producto(token, id_origen, cantidad_a_agregar, pagina)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "Los datos están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Eliminar resena producto
app.get('/eliminar_resena_producto/:id_origen', autorizacion_consumidor, (req: express.Request, res) => {
    try {
        let id_origen: number = parseInt(req.params.id_origen);
        let token: string = (hay_auth(req, res) as string[])[1];
        if (id_origen && token) {
            controlador.eliminar_resena_producto(token, id_origen)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        }
        else {
            return res.send({ error: "Los datos para la resena están incompletos" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Busqueda general
app.get('/creadores_contenido', (req: express.Request, res) =>{
    try{
        controlador.consultar_creadores_contenido()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });

    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// buscar parlantes
app.post('/buscar_parlantes', (req: express.Request, res) =>{
    try{
        let {titulo, marca, tipo_conexion, precio_min, precio_max, cantidad_a_buscar, pagina}:
            {titulo: string, marca: string, tipo_conexion: string, precio_min: number, 
                precio_max: number, cantidad_a_buscar: number, pagina: number} = req.body;
        if(titulo != undefined && cantidad_a_buscar && pagina){
            controlador.buscar_parlantes(titulo, marca, tipo_conexion, precio_min, precio_max, cantidad_a_buscar, pagina)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        }else{
            return res.send({ error: "Se necesita de al menos un titulo y los datos de paginacion" })
        }
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Buscar Audifonos
app.post('/buscar_audifonos', (req: express.Request, res) =>{
    try{
        let {titulo, marca, tipo_conexion, precio_min, precio_max, cantidad_a_buscar, pagina}:
            {titulo: string, marca: string, tipo_conexion: string, precio_min: number, 
                precio_max: number, cantidad_a_buscar: number, pagina: number} = req.body;
        if(titulo != undefined && cantidad_a_buscar && pagina){
            controlador.buscar_audifonos(titulo, marca, tipo_conexion, precio_min, precio_max, cantidad_a_buscar, pagina)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        }else{
            return res.send({ error: "Se necesita de al menos un titulo" })
        }
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Buscar Albumes
app.post('/buscar_albumes', (req: express.Request, res) =>{
    try{
        let {titulo, presentacion, genero, precio_min, precio_max, cantidad_a_buscar, pagina}:
            {titulo: string, presentacion: string, genero: string, precio_min: number, 
                precio_max:number, cantidad_a_buscar: number, pagina: number} = req.body;
        if(titulo != undefined && cantidad_a_buscar && pagina){
            controlador.buscar_albumes(titulo, presentacion, genero, precio_min, precio_max, cantidad_a_buscar, pagina)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        }else{
            return res.send({ error: "Se necesita de al menos un titulo" })
        }
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Buscar Blogs
app.post('/buscar_blogs', (req: express.Request, res) =>{
    try{
        let {titulo, id_categoria, fecha_min, fecha_max, cantidad_a_buscar, pagina}:
            {titulo: string, id_categoria: number, fecha_min: Date, fecha_max: Date, 
                cantidad_a_buscar: number, pagina: number} = req.body;
        if(titulo != undefined && cantidad_a_buscar && pagina){
            controlador.buscar_blogs(titulo, id_categoria, fecha_min, fecha_max, cantidad_a_buscar, pagina)
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        }else{
            return res.send({ error: "Se necesita de al menos un titulo" })
        }
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Busqueda marcas audifonos
app.get('/marcas_audifonos', (req: express.Request, res) =>{
    try{
        controlador.consultar_marcas_audifonos()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Busqueda marcas parlantes
app.get('/marcas_parlantes', (req: express.Request, res) =>{
    try{
        controlador.consultar_marcas_parlantes()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Busqueda tipos conexiones de audifonos
app.get('/tipos_conexiones_audifonos', (req: express.Request, res) =>{
    try{
        controlador.consultar_tipos_conexiones_audifonos()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Busqueda tipos conexiones de audifonos
app.get('/tipos_conexiones_parlantes', (req: express.Request, res) =>{
    try{
        controlador.consultar_tipos_conexiones_parlantes()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Buscar limites inferiores y superiores de precios de audifonos
app.get('/limites_precios_audifonos', (req: express.Request, res) =>{
    try{
        controlador.consultar_limites_precios_audifonos()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Buscar limites inferiores y superiores de precios de parlantes
app.get('/limites_precios_parlantes', (req: express.Request, res) =>{
    try{
        controlador.consultar_limites_precios_parlantes()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Busqueda presentaciones
app.get('/presentaciones_albumes', (req: express.Request, res) =>{
    try{
        controlador.consultar_presentaciones_albumes()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Busqueda generos
app.get('/generos_albumes', (req: express.Request, res) =>{
    try{
        controlador.consultar_generos_albumes()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Buscar limites inferiores y superiores de precios de albumes
app.get('/limites_precios_albumes', (req: express.Request, res) =>{
    try{
        controlador.consultar_limites_precios_albumes()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Buscar limites inferiores y superiores de fechas de blogs
app.get('/limites_fechas_blogs', (req: express.Request, res) =>{
    try{
        controlador.consultar_limites_fechas_blogs()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Buscar productos en general
app.get('/thumbnail_productos', (req: express.Request, res) =>{
    try{
        controlador.thumbnail_productos()
            .then((resultado: any) => {
                return res.send({ resultado });
            }).catch((err: any) => {
                return res.send({ error: err.message });
            });
    }catch (err: any) {
        return res.send({ error: err.message });
    }
})

// Inicio de sesion, se comunica con el controlador login
app.post('/validar_tipo_token', (req, res) => {
    try {
        let { token, id_tipo }: { token: string, id_tipo: string } = req.body;
        if (token && id_tipo) {
            return controlador_login.validar_tipo(token, parseInt(id_tipo))
                .then((resultado: any) => {
                    return res.send({ resultado });
                }).catch((err: any) => {
                    return res.send({ error: err.message });
                });
        } else {
            return res.send({ error: "El token no fue enviado" })
        }
    } catch (err: any) {
        return res.send({ error: err.message });
    }
})
