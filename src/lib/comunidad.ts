import { db } from "@/db";
import {
  communityMembers,
  communityBlocks,
  communityConversations,
  communityMessages,
  communityPosts,
  communityComments,
  patients,
} from "@/db/schema";
import { and, eq, or, desc, asc, ne, isNull, sql } from "drizzle-orm";

/** Límite de largo para posts, comentarios y mensajes: recortado en
 *  servidor. */
export const LARGO_MAXIMO_TEXTO = 500;

/** true si este paciente fue registrado en la comunidad por un cuidador. */
export async function esMiembroComunidad(patientId: number): Promise<boolean> {
  const filas = await db
    .select({ id: communityMembers.id })
    .from(communityMembers)
    .where(eq(communityMembers.patientId, patientId))
    .limit(1);
  return filas.length > 0;
}

export interface PostResumen {
  id: number;
  content: string;
  createdAt: Date | null;
  authorId: number;
  authorName: string;
  commentCount: number;
}

/** El feed del foro: posts no ocultos, con el nombre del autor y cuántos
 *  comentarios tiene cada uno. Usado por la página y por su API. */
export async function listarPostsForo(): Promise<PostResumen[]> {
  return db
    .select({
      id: communityPosts.id,
      content: communityPosts.content,
      createdAt: communityPosts.createdAt,
      authorId: communityPosts.patientId,
      authorName: patients.name,
      commentCount: sql<number>`count(${communityComments.id})::int`,
    })
    .from(communityPosts)
    .innerJoin(patients, eq(patients.id, communityPosts.patientId))
    .leftJoin(
      communityComments,
      and(eq(communityComments.postId, communityPosts.id), eq(communityComments.hidden, false)),
    )
    .where(eq(communityPosts.hidden, false))
    .groupBy(communityPosts.id, patients.name)
    .orderBy(desc(communityPosts.createdAt));
}

export interface ComentarioResumen {
  id: number;
  content: string;
  createdAt: Date | null;
  authorId: number;
  authorName: string;
}

export interface PostDetalle {
  id: number;
  content: string;
  createdAt: Date | null;
  authorId: number;
  authorName: string;
}

/** Un post con sus comentarios, o null si no existe / está oculto. Un post
 *  oculto (un cuidador resolvió un reporte ocultándolo) se trata como si no
 *  existiera: la moderación real vive en la app del cuidador, acá sólo se
 *  respeta. */
export async function obtenerPostConComentarios(
  postId: number,
): Promise<{ post: PostDetalle; comentarios: ComentarioResumen[] } | null> {
  const [post] = await db
    .select({
      id: communityPosts.id,
      content: communityPosts.content,
      createdAt: communityPosts.createdAt,
      authorId: communityPosts.patientId,
      authorName: patients.name,
    })
    .from(communityPosts)
    .innerJoin(patients, eq(patients.id, communityPosts.patientId))
    .where(and(eq(communityPosts.id, postId), eq(communityPosts.hidden, false)))
    .limit(1);

  if (!post) return null;

  const comentarios = await db
    .select({
      id: communityComments.id,
      content: communityComments.content,
      createdAt: communityComments.createdAt,
      authorId: communityComments.patientId,
      authorName: patients.name,
    })
    .from(communityComments)
    .innerJoin(patients, eq(patients.id, communityComments.patientId))
    .where(and(eq(communityComments.postId, postId), eq(communityComments.hidden, false)))
    .orderBy(asc(communityComments.createdAt));

  return { post, comentarios };
}

export interface ConversacionResumen {
  id: number;
  otroPacienteId: number;
  otroNombre: string;
  ultimoMensaje: string | null;
  ultimoMensajeFecha: Date | null;
  noLeidos: number;
}

/** Conversaciones de este paciente, con el otro nombre, el último mensaje y
 *  cuántos no leyó. Usado tanto por la página del listado como por su API
 *  (la API la necesita el cliente para refrescar sin recargar la página). */
export async function listarConversaciones(patientId: number): Promise<ConversacionResumen[]> {
  const conversaciones = await db
    .select({
      id: communityConversations.id,
      patientAId: communityConversations.patientAId,
      patientBId: communityConversations.patientBId,
    })
    .from(communityConversations)
    .where(
      or(
        eq(communityConversations.patientAId, patientId),
        eq(communityConversations.patientBId, patientId),
      ),
    );

  const conDatos = await Promise.all(
    conversaciones.map(async (c) => {
      const otroId = c.patientAId === patientId ? c.patientBId : c.patientAId;

      const [otro] = await db
        .select({ name: patients.name })
        .from(patients)
        .where(eq(patients.id, otroId))
        .limit(1);

      const [ultimo] = await db
        .select({
          content: communityMessages.content,
          createdAt: communityMessages.createdAt,
        })
        .from(communityMessages)
        .where(eq(communityMessages.conversationId, c.id))
        .orderBy(desc(communityMessages.createdAt))
        .limit(1);

      const noLeidos = await db
        .select({ id: communityMessages.id })
        .from(communityMessages)
        .where(
          and(
            eq(communityMessages.conversationId, c.id),
            ne(communityMessages.senderPatientId, patientId),
            isNull(communityMessages.readAt),
          ),
        );

      return {
        id: c.id,
        otroPacienteId: otroId,
        otroNombre: otro?.name ?? "Alguien",
        ultimoMensaje: ultimo?.content ?? null,
        ultimoMensajeFecha: ultimo?.createdAt ?? null,
        noLeidos: noLeidos.length,
      };
    }),
  );

  conDatos.sort((a, b) => {
    const fa = a.ultimoMensajeFecha ? new Date(a.ultimoMensajeFecha).getTime() : 0;
    const fb = b.ultimoMensajeFecha ? new Date(b.ultimoMensajeFecha).getTime() : 0;
    return fb - fa;
  });

  return conDatos;
}

export interface MiembroComunidad {
  id: number;
  name: string;
}

/** Los demás pacientes de la comunidad, para elegir con quién chatear.
 *  Excluye a quien este paciente bloqueó (a quien lo bloqueó a él sí se le
 *  sigue mostrando: bloquear no lo esconde del directorio, sólo corta los
 *  mensajes). */
export async function listarMiembrosParaChat(patientId: number): Promise<MiembroComunidad[]> {
  const bloqueados = await db
    .select({ blockedPatientId: communityBlocks.blockedPatientId })
    .from(communityBlocks)
    .where(eq(communityBlocks.blockerPatientId, patientId));
  const bloqueadosIds = new Set(bloqueados.map((b) => b.blockedPatientId));

  const miembros = await db
    .select({ id: patients.id, name: patients.name })
    .from(communityMembers)
    .innerJoin(patients, eq(patients.id, communityMembers.patientId))
    .where(ne(communityMembers.patientId, patientId));

  return miembros.filter((m) => !bloqueadosIds.has(m.id));
}

export interface ConversacionPropia {
  id: number;
  otroPacienteId: number;
  otroNombre: string;
}

/** La conversación, si el paciente de la sesión es uno de los dos
 *  participantes; null si no existe o no le pertenece. Usada tanto por la
 *  ruta de mensajes como por la página del hilo. */
export async function obtenerConversacionParaPaciente(
  conversationId: number,
  patientId: number,
): Promise<ConversacionPropia | null> {
  const [conversacion] = await db
    .select()
    .from(communityConversations)
    .where(eq(communityConversations.id, conversationId))
    .limit(1);

  if (!conversacion) return null;
  if (conversacion.patientAId !== patientId && conversacion.patientBId !== patientId) return null;

  const otroId = conversacion.patientAId === patientId ? conversacion.patientBId : conversacion.patientAId;
  const [otro] = await db.select({ name: patients.name }).from(patients).where(eq(patients.id, otroId)).limit(1);

  return { id: conversacion.id, otroPacienteId: otroId, otroNombre: otro?.name ?? "Alguien" };
}

/** true si alguno de los dos bloqueó al otro, en cualquier dirección. */
export async function hayBloqueoEntre(a: number, b: number): Promise<boolean> {
  const filas = await db
    .select({ id: communityBlocks.id })
    .from(communityBlocks)
    .where(
      or(
        and(eq(communityBlocks.blockerPatientId, a), eq(communityBlocks.blockedPatientId, b)),
        and(eq(communityBlocks.blockerPatientId, b), eq(communityBlocks.blockedPatientId, a)),
      ),
    )
    .limit(1);
  return filas.length > 0;
}
