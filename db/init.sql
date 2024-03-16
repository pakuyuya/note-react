CREATE USER appuser PASSWORD 'passw0rd!';

CREATE DATABASE pokedb OWNER appuser ENCODING UTF8;

--
-- switch to the pokedb database
--

CREATE SCHEMA pokedb AUTHORIZATION appuser;

DROP TABLE IF EXISTS pokedb.pokemon;
CREATE TABLE pokedb.pokemon(
	pokemon_id   INTEGER NOT NULL,
	pokemon_name VARCHAR(30) NOT NULL,
	pokemon_image BYTEA NOT NULL,
	type_code1   CHAR(2) NOT NULL,
	type_code2   CHAR(2),
	ability_id_1 INTEGER NOT NULL,
	ability_id_2 INTEGER,
	ability_id_hide INTEGER,
	base_hp INTEGER NOT NULL,
	base_atk INTEGER NOT NULL,
	base_def INTEGER NOT NULL,
	base_satk INTEGER NOT NULL,
	base_sdef INTEGER NOT NULL,
	base_spd INTEGER NOT NULL,
	create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	create_pgm TIMESTAMP NOT NULL,
	update_pgm TIMESTAMP NOT NULL,
	PRIMARY KEY (pokemon_id)
);
COMMENT ON TABLE pokedb.pokemon IS 'ポケモン';
COMMENT ON COLUMN pokedb.pokemon.pokemon_id IS 'ポケモンID';
COMMENT ON COLUMN pokedb.pokemon.pokemon_name IS 'ポケモン名';
COMMENT ON COLUMN pokedb.pokemon.pokemon_image IS 'ポケモン画像';
COMMENT ON COLUMN pokedb.pokemon.type_code1 IS 'タイプ1';
COMMENT ON COLUMN pokedb.pokemon.type_code2 IS 'タイプ2';
COMMENT ON COLUMN pokedb.pokemon.ability_id_1 IS '特性1';
COMMENT ON COLUMN pokedb.pokemon.ability_id_2 IS '特性2';
COMMENT ON COLUMN pokedb.pokemon.ability_id_hide IS '隠し特性';
COMMENT ON COLUMN pokedb.pokemon.base_hp IS 'HP';
COMMENT ON COLUMN pokedb.pokemon.base_atk IS '攻撃';
COMMENT ON COLUMN pokedb.pokemon.base_def IS '防御';
COMMENT ON COLUMN pokedb.pokemon.base_satk IS '特攻';
COMMENT ON COLUMN pokedb.pokemon.base_sdef IS '特防';
COMMENT ON COLUMN pokedb.pokemon.base_spd IS '素早さ';
COMMENT ON COLUMN pokedb.pokemon.create_at IS '作成日';
COMMENT ON COLUMN pokedb.pokemon.update_at IS '更新日';
COMMENT ON COLUMN pokedb.pokemon.create_pgm IS '作成プログラム';
COMMENT ON COLUMN pokedb.pokemon.update_pgm IS '更新プログラム';

DROP TABLE IF EXISTS pokedb.skill;
CREATE TABLE pokedb.skill(
	skill_id          INTEGER NOT NULL,
	skill_name        VARCHAR(30) NOT NULL,
	skill_description VARCHAR(400) NOT NULL,
	type_code         CHAR(2) NOT NULL,
	skill_attr_code   CHAR(1) NOT NULL,
	base_power        INTEGER NOT NULL,
	hit               INTEGER NOT NULL,
	max_pp            INTEGER NOT NULL,
	create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	create_pgm TIMESTAMP NOT NULL,
	update_pgm TIMESTAMP NOT NULL,
	PRIMARY KEY (skill_id)
);
COMMENT ON TABLE pokedb.skill IS 'わざ';
COMMENT ON COLUMN pokedb.skill.skill_id IS 'わざID';
COMMENT ON COLUMN pokedb.skill.skill_name IS 'わざ名';
COMMENT ON COLUMN pokedb.skill.skill_description IS 'わざの説明';
COMMENT ON COLUMN pokedb.skill.type_code IS 'タイプ';
COMMENT ON COLUMN pokedb.skill.skill_attr_code IS 'わざ属性';
COMMENT ON COLUMN pokedb.skill.base_power IS '威力';
COMMENT ON COLUMN pokedb.skill.hit IS '命中率';
COMMENT ON COLUMN pokedb.skill.max_pp IS '最大PP';
COMMENT ON COLUMN pokedb.skill.create_at IS '作成日';
COMMENT ON COLUMN pokedb.skill.update_at IS '更新日';
COMMENT ON COLUMN pokedb.skill.create_pgm IS '作成プログラム';
COMMENT ON COLUMN pokedb.skill.update_pgm IS '更新プログラム';

DROP TABLE IF EXISTS pokedb.ability;
CREATE TABLE pokedb.ability(
	ability_id          INTEGER NOT NULL,
	ability_name        VARCHAR(30) NOT NULL,
	ability_description VARCHAR(400) NOT NULL,
	create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	create_pgm TIMESTAMP NOT NULL,
	update_pgm TIMESTAMP NOT NULL,
	PRIMARY KEY (ability_id)
);
COMMENT ON TABLE pokedb.ability IS '特性';
COMMENT ON COLUMN pokedb.ability.ability_id IS '特性ID';
COMMENT ON COLUMN pokedb.ability.ability_name IS '特性名';
COMMENT ON COLUMN pokedb.ability.ability_description IS '特性の説明';
COMMENT ON COLUMN pokedb.ability.create_at IS '作成日';
COMMENT ON COLUMN pokedb.ability.update_at IS '更新日';
COMMENT ON COLUMN pokedb.ability.create_pgm IS '作成プログラム';
COMMENT ON COLUMN pokedb.ability.update_pgm IS '更新プログラム';

DROP TABLE IF EXISTS pokedb.item;
CREATE TABLE pokedb.item(
	item_id INTEGER NOT NULL,
	item_name VARCHAR(30) NOT NULL,
	create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	create_pgm TIMESTAMP NOT NULL,
	update_pgm TIMESTAMP NOT NULL,
	PRIMARY KEY (item_id)
);
COMMENT ON TABLE pokedb.item IS 'どうぐ';
COMMENT ON COLUMN pokedb.item.item_id IS 'どうぐID';
COMMENT ON COLUMN pokedb.item.item_name IS 'どうぐ名';
COMMENT ON COLUMN pokedb.item.create_at IS '作成日';
COMMENT ON COLUMN pokedb.item.update_at IS '更新日';
COMMENT ON COLUMN pokedb.item.create_pgm IS '作成プログラム';
COMMENT ON COLUMN pokedb.item.update_pgm IS '更新プログラム';

DROP TABLE IF EXISTS pokedb.pokemon_skill;
CREATE TABLE pokedb.pokemon_skill(
	pokemon_id INTEGER NOT NULL,
	skill_id   INTEGER NOT NULL,
	PRIMARY KEY (pokemon_id, skill_id)
);
COMMENT ON TABLE pokedb.pokemon_skill IS 'ポケモンとわざの関連';
COMMENT ON COLUMN pokedb.pokemon_skill.pokemon_id IS 'ポケモンID';
COMMENT ON COLUMN pokedb.pokemon_skill.skill_id IS 'わざID';

DROP TABLE IF EXISTS pokedb.pokemon_evolution;
CREATE TABLE pokedb.pokemon_evolution(
	pokemon_id_prev INTEGER NOT NULL,
	pokemon_id_next INTEGER NOT NULL,
	evolution_kind CHAR(1) NOT NULL,
	evolution_level INTEGER,
	evolution_item_id INTEGER,
	evolution_trust INTEGER,
	time_kind CHAR(1),
	evolution_text VARCHAR(50) NOT NULL,
	create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	create_pgm TIMESTAMP NOT NULL,
	update_pgm TIMESTAMP NOT NULL,
	PRIMARY KEY (pokemon_id_prev, pokemon_id_next)
);
COMMENT ON TABLE pokedb.pokemon_evolution IS 'ポケモン進化';
COMMENT ON COLUMN pokedb.pokemon_evolution.pokemon_id_prev IS '進化元ポケモンID';
COMMENT ON COLUMN pokedb.pokemon_evolution.pokemon_id_next IS '進化先ポケモンID';
COMMENT ON COLUMN pokedb.pokemon_evolution.evolution_kind IS '進化種別';
COMMENT ON COLUMN pokedb.pokemon_evolution.evolution_level IS '進化レベル';
COMMENT ON COLUMN pokedb.pokemon_evolution.evolution_item_id IS '進化アイテムID';
COMMENT ON COLUMN pokedb.pokemon_evolution.evolution_trust IS '進化なつき度';
COMMENT ON COLUMN pokedb.pokemon_evolution.time_kind IS '進化時間帯';
COMMENT ON COLUMN pokedb.pokemon_evolution.evolution_text IS '進化テキスト';
COMMENT ON COLUMN pokedb.pokemon_evolution.create_at IS '作成日';
COMMENT ON COLUMN pokedb.pokemon_evolution.update_at IS '更新日';
COMMENT ON COLUMN pokedb.pokemon_evolution.create_pgm IS '作成プログラム';
COMMENT ON COLUMN pokedb.pokemon_evolution.update_pgm IS '更新プログラム';
