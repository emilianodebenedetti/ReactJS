import React from 'react'
import { useState } from "react"
import { useCartContext } from '../../context/CartContext'
import CartList from './CartList'
import { actualizarStock, generarOrden  } from "../../firebase/firebaseService"
import swal from 'sweetalert'
import { Link } from 'react-router-dom'
import CartResume from './CartResume'

const compradorInicial = {
   name: "",
   phone: "",
   email: "",
}

export const Cart = () => {
   
   const { cart, deleteCart } = useCartContext()
   const [comprador, setComprador] = useState(compradorInicial)
   const vaciarLista = () => { deleteCart() } //usamos funcion anonima para no generar un render infinito

   cart.forEach((item) => {
      console.log(item)
   })

   //meter const----------------------
   let total = 0

   for (let i = 0; i < cart.length; i++) {
      const price = cart[i].price * cart[i].quantity

      total += price
   }
   //---------------------------------------

   const orden = {
      comprador,
      item: cart,
      total,
   }

   const handlerSubmit = (e) => {
      e.preventDefault()
      if(comprador.name !== "" && comprador.phone !== "" && comprador.email !== "") {
         generarOrden(orden)
            .then((res) => {
               new swal ({
                  title:"Orden recibida con éxito!",
                  text: `Nº de orden: ${res.id}`,
                  icon: "success",
                  button: "Ok",
               })
            })
            .then(() => cart.forEach(item => actualizarStock(item.id, item.quantity)))
            .then(() => deleteCart())
            .catch(
               (err) => new swal(`Hubo un error`, "Intenta de nuevo", "error")
            )
      } else {
        new swal({
            title:"Hubo un error en tus datos",
            text: "Completa el formulario con tus datos para continuar",
            icon: "error",
            button: "Ok",
        })
      }
   }

   const handlerChange = (e) => {
      setComprador({
         ...comprador,
         [e.target.name]: e.target.value,
      })
   }


   return (
     <>
        <div className="grid grid-cols-1 content-center">
			<h1 className="p-3 mt-2 divider">Carrito de compras</h1>
			<hr />

			<div className="">
				<div className="col-md-8">
					{cart.length !== 0 && (
						<>
							{cart.map((product) => (
								<CartList key={product.id}	
								product={product} 
								stock={product.stock}
								price={product.price}
								img={product.img}
								/> 
							))}
							<div className="text-end m-3">
								<button className="btn" onClick={deleteCart}>
									Limpiar Carrito
								</button>
							</div>
						</>
					)}
					{cart.length === 0 && (
						<>
							<br/>
							<h3 className='text-center'>Aún no tienes productos en el carrito...</h3>
							<Link
								to="/"
								className="grid content-center btn text-white d-block w-100 mt-3 "
							>
								Busquemos algo!{" "}
							</Link>
						</>
					)}
				</div>
				<div className="col-md-4">
					{cart.length !== 0 && (
						<>
							<div className="card ">
								<h2 className="mt-3 text-center">Resumen Carrito</h2>

								{cart.map((prod) => (
									<CartResume 
									key={prod.id} 
									product={prod} 
                           		/>
								))}

								<h3 className='text-center'>Total a pagar: ${total}</h3>

								<hr />
								<p className='text-center'>Completa con tus datos para terminar tu pedido</p>
								<form
									onSubmit={handlerSubmit}
									onChange={handlerChange}
									className="flex flex-col justify-center mt-2 mb-3 mx-48 "
								>
									<input
										className="mb-2 text-center"
										type="text"
										placeholder="Nombre"
										name="name"
										value={orden.name}
									/>
									<input
										className="form-control mb-2 text-center"
										type="number"
										placeholder="Telefono"
										name="phone"
										value={orden.phone}
									/>
									<input
										className="form-control mb-2 text-center"
										type="email"
										placeholder="Email"
										name="email"
										value={orden.email}
									/>

									<button className="btn btn-success d-block mt-2">
										Enviar orden
									</button>
								</form>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
     </>
   )
}

 
 export default Cart
 