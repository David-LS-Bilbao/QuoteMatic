import { Request, Response } from "express";
import mongoose from "mongoose";

import { Author } from "../../models/Author";
import {
  AUTHOR_TYPES,
  SOURCE_TYPES,
  VERIFICATION_STATUSES,
  type AuthorType,
  type SourceType,
  type VerificationStatus,
} from "../../types/domain.types";

const normalizeText = (value: string): string =>
  value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const isValidMongoId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

const getUser = (req: Request) => ({
  isAuthenticated: true,
  role: req.session.role ?? null,
  ageGroup: req.session.ageGroup ?? null,
});

const FORM_CATALOGS = {
  authorTypes: AUTHOR_TYPES,
  sourceTypes: SOURCE_TYPES,
  verificationStatuses: VERIFICATION_STATUSES,
};

export const listAdminAuthors = async (req: Request, res: Response): Promise<void> => {
  const authors = await Author.find().sort({ name: 1 }).limit(100).lean();

  res.render("admin/authors", {
    title: "Autores | Admin | QuoteMatic",
    authors,
    msg: req.query.msg ?? null,
    user: getUser(req),
  });
};

export const newAdminAuthorForm = (req: Request, res: Response): void => {
  res.render("admin/author-form", {
    title: "Nuevo autor | Admin | QuoteMatic",
    author: null,
    ...FORM_CATALOGS,
    error: null,
    user: getUser(req),
  });
};

export const createAdminAuthor = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Record<string, string>;
  const { name, authorType, sourceWork, sourceType, verificationSource, verificationStatus } = body;

  const renderError = (error: string): void => {
    res.status(400).render("admin/author-form", {
      title: "Nuevo autor | Admin | QuoteMatic",
      author: body,
      ...FORM_CATALOGS,
      error,
      user: getUser(req),
    });
  };

  if (!name?.trim()) {
    renderError("El nombre del autor es obligatorio.");
    return;
  }

  try {
    await Author.create({
      name: name.trim(),
      normalizedName: normalizeText(name),
      authorType: (authorType as AuthorType) || "unknown",
      sourceWork: sourceWork?.trim() || undefined,
      sourceType: (sourceType as SourceType) || "unknown",
      verificationSource: verificationSource?.trim() || undefined,
      verificationStatus: (verificationStatus as VerificationStatus) || "pending",
      isVerified: false,
      isActive: true,
    });

    res.redirect("/admin/authors?msg=Autor+creado+correctamente.");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear el autor.";
    renderError(message);
  }
};

export const editAdminAuthorForm = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  if (!isValidMongoId(id)) {
    res.redirect("/admin/authors");
    return;
  }

  const author = await Author.findById(id).lean();

  if (!author) {
    res.redirect("/admin/authors");
    return;
  }

  res.render("admin/author-form", {
    title: "Editar autor | Admin | QuoteMatic",
    author,
    ...FORM_CATALOGS,
    error: null,
    user: getUser(req),
  });
};

export const updateAdminAuthor = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  if (!isValidMongoId(id)) {
    res.redirect("/admin/authors");
    return;
  }

  const body = req.body as Record<string, string>;
  const { name, authorType, sourceWork, sourceType, verificationSource, verificationStatus, isActive } = body;

  const renderError = async (error: string): Promise<void> => {
    const original = await Author.findById(id).lean();
    res.status(400).render("admin/author-form", {
      title: "Editar autor | Admin | QuoteMatic",
      author: { ...original, ...body, _id: id },
      ...FORM_CATALOGS,
      error,
      user: getUser(req),
    });
  };

  if (!name?.trim()) {
    await renderError("El nombre del autor es obligatorio.");
    return;
  }

  try {
    await Author.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        normalizedName: normalizeText(name),
        authorType: (authorType as AuthorType) || "unknown",
        sourceWork: sourceWork?.trim() || undefined,
        sourceType: (sourceType as SourceType) || "unknown",
        verificationSource: verificationSource?.trim() || undefined,
        verificationStatus: (verificationStatus as VerificationStatus) || "pending",
        isActive: isActive === "on" || isActive === "true",
      },
      { runValidators: true }
    );

    res.redirect("/admin/authors?msg=Autor+actualizado+correctamente.");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al actualizar el autor.";
    await renderError(message);
  }
};

export const deleteAdminAuthor = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  if (isValidMongoId(id)) {
    await Author.findByIdAndUpdate(id, { isActive: false });
  }

  res.redirect("/admin/authors?msg=Autor+desactivado.");
};
