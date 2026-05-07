import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { productsRouter } from "./products.routes.js";
import { cartRouter } from "./cart.routes.js";
import { wishlistRouter } from "./wishlist.routes.js";
import { reviewsRouter } from "./reviews.routes.js";
import { ordersRouter } from "./orders.routes.js";
import { adminRouter } from "./admin.routes.js";
import { miscRouter } from "./misc.routes.js";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.json({ ok: true });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/wishlist", wishlistRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/", miscRouter);

