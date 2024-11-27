import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Artist } from '../Artist/artist.entity';
import { Album } from '../Album/album.entity';
import { Track } from '../Track/track.entity';

@Entity()
export class Favorite {
  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => Artist, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string;

  @ManyToOne(() => Album, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @Column({ nullable: true })
  albumId: string;

  @ManyToOne(() => Track, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: Track;

  @Column({ nullable: true })
  trackId: string;
}
